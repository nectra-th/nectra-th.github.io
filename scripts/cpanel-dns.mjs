#!/usr/bin/env node
// cPanel DNS zone helper for grechjewellers.com.au.
//
// Credentials come from .env.local (gitignored): CPANEL_HOST / CPANEL_USER /
// CPANEL_TOKEN / CPANEL_DOMAIN. Nothing is hardcoded here, so this file is
// safe to commit.
//
//   node scripts/cpanel-dns.mjs list
//   node scripts/cpanel-dns.mjs list --all
//   node scripts/cpanel-dns.mjs edit '[{"line":5,"name":"mail","type":"A","data":["1.2.3.4"],"ttl":300}]'
//
// `edit` re-reads the zone first so the SOA serial is always current (cPanel
// rejects edits carrying a stale serial), and prints a before/after diff.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trimStart().startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const { CPANEL_HOST, CPANEL_USER, CPANEL_TOKEN, CPANEL_DOMAIN } = env;
if (!CPANEL_HOST || !CPANEL_USER || !CPANEL_TOKEN || !CPANEL_DOMAIN) {
  console.error("Missing CPANEL_HOST / CPANEL_USER / CPANEL_TOKEN / CPANEL_DOMAIN in .env.local");
  process.exit(1);
}
const AUTH = `cpanel ${CPANEL_USER}:${CPANEL_TOKEN}`;
const API = (endpoint) => `https://${CPANEL_HOST}/execute/${endpoint}`;
const dec = (b64) => Buffer.from(b64, "base64").toString();

async function call(endpoint, { method = "GET", body } = {}) {
  const res = await fetch(API(endpoint), {
    method,
    headers: { Authorization: AUTH, ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}) },
    body,
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.join("; "));
  return json;
}

/** Current zone as {serial, records:[{line,name,type,ttl,data[]}]}. */
async function readZone() {
  const json = await call(`DNS/parse_zone?zone=${encodeURIComponent(CPANEL_DOMAIN)}`);
  const records = (json.data || [])
    .filter((r) => r.type === "record")
    .map((r) => ({
      line: r.line_index,
      name: r.dname_b64 ? dec(r.dname_b64) : "",
      type: r.record_type,
      ttl: r.ttl,
      data: (r.data_b64 || []).map(dec),
    }));
  const soa = records.find((r) => r.type === "SOA");
  // serial is the 3rd field of SOA rdata: <ns> <hostmaster> <serial> ...
  return { serial: soa?.data?.[2] ?? soa?.data?.join(" ").split(/\s+/)[2], records };
}

const fmt = (r) => `${String(r.line).padStart(3)}  ${r.type.padEnd(6)} ttl ${String(r.ttl).padEnd(6)} ${r.name.padEnd(30)} -> ${r.data.join(" ")}`;

const [cmd, arg] = process.argv.slice(2);

if (!cmd || cmd === "list") {
  const { serial, records } = await readZone();
  const show = arg === "--all" ? records : records.filter((r) => ["A", "AAAA", "CNAME", "MX", "TXT"].includes(r.type));
  console.log(`zone ${CPANEL_DOMAIN} (serial ${serial}) — ${show.length} records`);
  show.forEach((r) => console.log(fmt(r)));
} else if (cmd === "edit") {
  if (!arg) { console.error('Usage: edit \'[{"line":N,"name":"...","type":"A","data":["..."],"ttl":300}]\''); process.exit(1); }
  const edits = JSON.parse(arg);
  const before = await readZone();
  const byLine = new Map(before.records.map((r) => [r.line, r]));

  const params = new URLSearchParams();
  params.append("zone", CPANEL_DOMAIN);
  params.append("serial", before.serial);
  for (const e of edits) {
    const cur = byLine.get(e.line);
    if (!cur) throw new Error(`line ${e.line} not found in zone`);
    const next = { line: e.line, name: e.name ?? cur.name, type: e.type ?? cur.type, ttl: e.ttl ?? cur.ttl, data: e.data ?? cur.data };
    console.log("  -", fmt(cur));
    console.log("  +", fmt(next));
    params.append("edit", JSON.stringify({ line_index: next.line, dname: next.name, ttl: next.ttl, record_type: next.type, data: next.data }));
  }
  await call("DNS/mass_edit_zone", { method: "POST", body: params });
  console.log("\napplied. verifying…\n");
  const after = await readZone();
  edits.forEach((e) => {
    const r = after.records.find((x) => x.line === e.line);
    if (r) console.log("  now", fmt(r));
  });
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
