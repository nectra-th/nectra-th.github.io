// No fallback on purpose: isAdmin() rejects everything when ADMIN_KEY is
// unset (empty key never matches), instead of silently activating a weak
// default that would sit published in the repo.
export const ADMIN_KEY = process.env.ADMIN_KEY ?? "";

/** Admin auth via `x-admin-key` header or `?key=` query param. */
export function isAdmin(req: Request): boolean {
  const key = req.headers.get("x-admin-key") ?? new URL(req.url).searchParams.get("key") ?? "";
  return ADMIN_KEY.length > 0 && key === ADMIN_KEY;
}
