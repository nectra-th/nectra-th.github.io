// Persistence primitive — JSON objects in a PRIVATE Supabase Storage bucket.
// Private = only the service key can read/write, so customer PII is never public.
// No SQL/DDL needed (just a bucket), and it has its own quota independent of the
// (currently maxed) Upstash Redis. Low booking volume → plain read-modify-write.

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";
const BUCKET = process.env.STORE_BUCKET ?? "grech";

export const storeConfigured = () => Boolean(SUPABASE_URL && SERVICE_KEY);

const authHeaders = () => ({ apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` });
const objectUrl = (name: string) => `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`;

let bucketReady = false;
async function ensureBucket(): Promise<void> {
  if (bucketReady) return;
  // idempotent: 200 on create, 400/409 if it already exists — both are fine
  await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: false }),
  }).catch(() => {});
  bucketReady = true;
}

/** Read a JSON object; returns `fallback` when the object doesn't exist yet.
 *  Cache-busted so the admin always reads the latest write (avoids any edge/CDN
 *  or undici caching serving a stale copy right after a mutation). */
export async function readJson<T>(name: string, fallback: T): Promise<T> {
  if (!storeConfigured()) return fallback;
  const res = await fetch(`${objectUrl(name)}?_cb=${Date.now()}`, { headers: authHeaders(), cache: "no-store" });
  if (res.status === 404 || res.status === 400) return fallback;
  if (!res.ok) throw new Error(`store read "${name}" failed: ${res.status}`);
  try {
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** Write (upsert) a JSON object. */
export async function writeJson(name: string, data: unknown): Promise<void> {
  if (!storeConfigured()) throw new Error("Storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY).");
  await ensureBucket();
  const res = await fetch(objectUrl(name), {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json", "x-upsert": "true", "cache-control": "no-cache, max-age=0" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`store write "${name}" failed: ${res.status} ${await res.text()}`);
}
