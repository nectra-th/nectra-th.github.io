"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AvailabilityConfig, Booking, EmailTemplateKey, OutboxEntry, Templates, TemplateVersions } from "@/lib/booking-types";

/* Grech Jewellers — booking admin.
   Default = a plain-language DAY SCHEDULE (timeline of slots, accept/cancel/add).
   Advanced (tucked away) = full booking list, availability rules, email templates
   (WYSIWYG + HTML + version history) and the email outbox. */

const GOLD = "#b88c46", INK = "#161412", CREAM = "#f4efe6", LINE = "#2e2c2a", BG = "#0f0e0d";
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Api = (p: string, m?: string, b?: unknown) => Promise<any>;
const card: React.CSSProperties = { background: INK, border: `1px solid ${LINE}`, borderRadius: 12, padding: 20 };
const btn = (bg = GOLD, fg = "#141312"): React.CSSProperties => ({ padding: "9px 16px", borderRadius: 8, border: "none", background: bg, color: fg, fontWeight: 600, cursor: "pointer" });
const input: React.CSSProperties = { padding: "9px 11px", borderRadius: 7, border: `1px solid ${LINE}`, background: BG, color: CREAM };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const longDate = (s: string) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }); };
const STATUS = { pending: { c: "#e0a94a", label: "Waiting for your OK" }, confirmed: { c: "#5aa06a", label: "Confirmed" }, declined: { c: "#a05a5a", label: "Cancelled" } } as Record<string, { c: string; label: string }>;

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"day" | "bookings" | "availability" | "templates" | "outbox">("day");
  const [advanced, setAdvanced] = useState(false);

  const api = useCallback(async (path: string, method = "GET", body?: unknown) => {
    const res = await fetch(path, { method, headers: { "x-admin-key": key, ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }, [key]);

  useEffect(() => { const k = new URL(window.location.href).searchParams.get("key") || localStorage.getItem("gj_admin_key") || ""; if (k) setKey(k); }, []);
  const tryAuth = useCallback(async (k: string) => {
    setErr("");
    try { const res = await fetch("/api/admin/bookings", { headers: { "x-admin-key": k } }); if (res.ok) { setAuthed(true); localStorage.setItem("gj_admin_key", k); } else setErr("That admin key didn't work."); }
    catch { setErr("Could not reach the server."); }
  }, []);
  useEffect(() => { if (key && !authed) tryAuth(key); }, [key, authed, tryAuth]);

  if (!authed) {
    return (
      <main style={{ minHeight: "100vh", background: BG, color: CREAM, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center", width: 340 }}>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 30, letterSpacing: 4 }}>GRECH JEWELLERS</div>
          <div style={{ color: GOLD, letterSpacing: 3, fontSize: 12, marginTop: 4 }}>BOOKINGS</div>
          <input type="password" placeholder="Enter password" value={key} onChange={(e) => setKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryAuth(key)}
            style={{ width: "100%", marginTop: 24, padding: "13px 14px", borderRadius: 8, border: `1px solid ${LINE}`, background: INK, color: CREAM, fontSize: 16 }} />
          <button onClick={() => tryAuth(key)} style={{ width: "100%", marginTop: 10, padding: "13px", borderRadius: 8, border: "none", background: GOLD, color: "#141312", fontWeight: 700, cursor: "pointer", fontSize: 16 }}>Enter</button>
          {err && <div style={{ color: "#e08a7a", marginTop: 12, fontSize: 14 }}>{err}</div>}
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: BG, color: CREAM, fontFamily: "system-ui" }}>
      <header style={{ borderBottom: `1px solid ${LINE}`, padding: "16px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 22, letterSpacing: 2 }}>GRECH <span style={{ color: GOLD }}>Bookings</span></div>
        <button onClick={() => { setTab("day"); setAdvanced(false); }} style={{ ...btn(tab === "day" ? GOLD : "transparent", tab === "day" ? "#141312" : CREAM), fontSize: 16, padding: "10px 20px", border: tab === "day" ? "none" : `1px solid ${LINE}` }}>📅 Day schedule</button>
        <button onClick={() => setAdvanced((a) => !a)} style={{ ...btn("transparent", advanced ? GOLD : "#9f968a"), border: `1px solid ${LINE}`, marginLeft: "auto" }}>⚙ Advanced {advanced ? "▲" : "▼"}</button>
      </header>
      {advanced && (
        <div style={{ borderBottom: `1px solid ${LINE}`, padding: "10px 28px", display: "flex", gap: 6, background: "#12100e", flexWrap: "wrap" }}>
          {(["bookings", "availability", "templates", "outbox"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btn(tab === t ? GOLD : "transparent", tab === t ? "#141312" : CREAM), padding: "7px 14px", border: tab === t ? "none" : `1px solid ${LINE}` }}>
              {{ bookings: "All bookings", availability: "Availability", templates: "Email templates", outbox: "Email outbox" }[t]}</button>
          ))}
        </div>
      )}
      <div style={{ maxWidth: tab === "templates" ? 1160 : 900, margin: "0 auto", padding: "26px 22px 90px" }}>
        {tab === "day" && <DayView api={api} />}
        {tab === "bookings" && <AllBookings api={api} />}
        {tab === "availability" && <Availability api={api} />}
        {tab === "templates" && <TemplatesTab api={api} />}
        {tab === "outbox" && <Outbox api={api} />}
      </div>
    </main>
  );
}

// ================= SIMPLE: Day schedule (timeline) =================
function DayView({ api }: { api: Api }) {
  const [cfg, setCfg] = useState<AvailabilityConfig | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [day, setDay] = useState(() => iso(new Date()));
  const [addSlot, setAddSlot] = useState<string | null>(null);
  const [info, setInfo] = useState<Booking | null>(null);
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    const [c, b] = await Promise.all([api("/api/admin/config"), api("/api/admin/bookings")]);
    setCfg(c.config); setBookings(b.bookings);
  }, [api]);
  useEffect(() => { load(); }, [load]);

  const decide = async (id: string, action: "approve" | "cancel") => { setBusy(id); try { await api("/api/admin/bookings", "PATCH", { id, action }); await load(); } finally { setBusy(""); } };
  const shift = (n: number) => { const d = new Date(day + "T00:00:00"); d.setDate(d.getDate() + n); setDay(iso(d)); };

  if (!cfg) return <div style={{ color: "#8c857a" }}>Loading…</div>;
  const active = bookings.filter((b) => b.status !== "declined");
  const pending = bookings.filter((b) => b.status === "pending").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const dObj = new Date(day + "T00:00:00");
  const open = cfg.openWeekdays.includes(dObj.getDay());
  const forDay = (slot: string) => active.filter((b) => b.date === day && b.time === slot);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* New requests needing action */}
      {pending.length > 0 && (
        <div style={{ ...card, borderColor: "#5a4a22", background: "#1c1810" }}>
          <div style={{ color: "#e0a94a", fontSize: 18, fontWeight: 700, marginBottom: 12 }}>🔔 {pending.length} new request{pending.length > 1 ? "s" : ""} — please accept or decline</div>
          <div style={{ display: "grid", gap: 10 }}>
            {pending.map((b) => (
              <div key={b.id} style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${LINE}`, paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>{b.name} <span style={{ color: "#9f968a", fontWeight: 400 }}>· {b.phone}</span></div>
                  <div style={{ color: "#b9b2a4", fontSize: 14 }}>{longDate(b.date)} at {b.time}{b.project ? ` · ${b.project}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button disabled={busy === b.id} onClick={() => decide(b.id, "approve")} style={{ ...btn("#5aa06a", "#fff"), fontSize: 15, padding: "10px 20px" }}>✓ Accept</button>
                  <button disabled={busy === b.id} onClick={() => decide(b.id, "cancel")} style={{ ...btn("transparent", "#c98a7a"), border: "1px solid #6a4540" }}>Decline</button>
                  <button onClick={() => setInfo(b)} style={{ ...btn("transparent", CREAM), border: `1px solid ${LINE}` }}>Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Day navigator */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button onClick={() => shift(-1)} style={{ ...btn("#232019", CREAM), fontSize: 18, padding: "8px 16px" }}>◀</button>
        <div style={{ fontFamily: "Georgia,serif", fontSize: 26, minWidth: 300, textAlign: "center" }}>{longDate(day)}</div>
        <button onClick={() => shift(1)} style={{ ...btn("#232019", CREAM), fontSize: 18, padding: "8px 16px" }}>▶</button>
        <button onClick={() => setDay(iso(new Date()))} style={{ ...btn("transparent", GOLD), border: `1px solid ${LINE}` }}>Today</button>
      </div>

      {/* Timeline */}
      {!open ? (
        <div style={{ ...card, textAlign: "center", color: "#9f968a", fontSize: 16 }}>Closed on this day. Use ◀ ▶ to pick another day.</div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {cfg.timeSlots.map((slot) => {
            const bs = forDay(slot);
            return (
              <div key={slot} style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 12, alignItems: "start" }}>
                <div style={{ color: "#9f968a", fontSize: 15, fontWeight: 600, paddingTop: 16, textAlign: "right" }}>{slot}</div>
                <div style={{ display: "grid", gap: 8 }}>
                  {bs.length === 0 && (
                    <button onClick={() => setAddSlot(slot)} style={{ ...card, padding: "14px 18px", textAlign: "left", cursor: "pointer", color: "#6f675c", border: `1px dashed ${LINE}`, background: "transparent" }}>＋ Add appointment</button>
                  )}
                  {bs.length > 1 && <div style={{ color: "#e07a6a", fontWeight: 600, fontSize: 13 }}>⚠ Two bookings at this time</div>}
                  {bs.map((b) => (
                    <div key={b.id} style={{ ...card, padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", borderLeft: `4px solid ${STATUS[b.status].c}` }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 600 }}>{b.name}</div>
                        <div style={{ color: "#b9b2a4", fontSize: 14 }}>{b.phone}{b.project ? ` · ${b.project}` : ""} · <span style={{ color: STATUS[b.status].c }}>{STATUS[b.status].label}</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {b.status === "pending" && <button disabled={busy === b.id} onClick={() => decide(b.id, "approve")} style={{ ...btn("#5aa06a", "#fff") }}>✓ Accept</button>}
                        <button disabled={busy === b.id} onClick={() => { if (confirm("Cancel this appointment?")) decide(b.id, "cancel"); }} style={{ ...btn("transparent", "#c98a7a"), border: "1px solid #6a4540" }}>Cancel</button>
                        <button onClick={() => setInfo(b)} style={{ ...btn("transparent", CREAM), border: `1px solid ${LINE}` }}>Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {addSlot && <AddModal api={api} day={day} slot={addSlot} onClose={() => setAddSlot(null)} onSaved={() => { setAddSlot(null); load(); }} />}
      {info && <InfoModal booking={info} onClose={() => setInfo(null)} />}
    </div>
  );
}

function AddModal({ api, day, slot, onClose, onSaved }: { api: Api; day: string; slot: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "" });
  const [emailCust, setEmailCust] = useState(false);
  const [msg, setMsg] = useState("");
  const save = async () => {
    if (f.name.trim().length < 2 || f.phone.replace(/\D/g, "").length < 6) { setMsg("Please enter a name and phone number."); return; }
    setMsg("Saving…");
    try { await api("/api/admin/bookings", "POST", { ...f, date: day, time: slot, status: "confirmed", sendEmail: emailCust && !!f.email }); onSaved(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "error"); }
  };
  return (
    <Modal onClose={onClose} title={`New appointment · ${longDate(day)} at ${slot}`}>
      <div style={{ display: "grid", gap: 12 }}>
        {([["name", "Customer name *"], ["phone", "Phone number *"], ["email", "Email (optional)"], ["project", "What for? (optional)"]] as const).map(([k, label]) => (
          <label key={k} style={{ display: "grid", gap: 4, fontSize: 14, color: "#9f968a" }}>{label}
            <input style={{ ...input, fontSize: 16, padding: "11px 12px" }} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></label>
        ))}
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: f.email ? CREAM : "#6f675c" }}>
          <input type="checkbox" disabled={!f.email} checked={emailCust} onChange={(e) => setEmailCust(e.target.checked)} /> Email a confirmation to the customer</label>
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
          <button style={{ ...btn(), fontSize: 16, padding: "11px 22px" }} onClick={save}>Save appointment</button>
          <button style={btn("transparent", CREAM)} onClick={onClose}>Cancel</button>
          <span style={{ color: "#c98a7a", fontSize: 13 }}>{msg}</span>
        </div>
      </div>
    </Modal>
  );
}

function InfoModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const rows: [string, string][] = [["Name", booking.name], ["Phone", booking.phone], ["Email", booking.email || "—"], ["Date", longDate(booking.date)], ["Time", booking.time], ["For", booking.project || "—"], ["Notes", booking.notes || "—"], ["Reference", booking.reference], ["Status", STATUS[booking.status]?.label ?? booking.status]];
  return (
    <Modal onClose={onClose} title="Appointment details">
      <table style={{ width: "100%", borderCollapse: "collapse" }}><tbody>
        {rows.map(([k, v]) => <tr key={k}><td style={{ padding: "9px 0", color: "#8c857a", width: 120, fontSize: 14 }}>{k}</td><td style={{ padding: "9px 0", fontSize: 15 }}>{v}</td></tr>)}
      </tbody></table>
    </Modal>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 480, maxWidth: "100%", background: INK, border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <b style={{ fontSize: 15 }}>{title}</b><button onClick={onClose} style={btn("transparent", CREAM)}>✕</button></div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ================= ADVANCED tabs =================
function AllBookings({ api }: { api: Api }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [busy, setBusy] = useState("");
  const load = useCallback(() => api("/api/admin/bookings").then((d) => setRows(d.bookings)).catch(() => {}), [api]);
  useEffect(() => { load(); }, [load]);
  const decide = async (id: string, action: string) => { setBusy(id); try { await api("/api/admin/bookings", "PATCH", { id, action }); await load(); } finally { setBusy(""); } };
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24 }}>All bookings <span style={{ color: "#8c857a", fontSize: 15 }}>({rows.length})</span></h2>
      <div style={{ ...card, marginTop: 14, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left", color: "#8c857a" }}>{["Date", "Time", "Name", "Contact", "Ref", "Status", ""].map((h) => <th key={h} style={{ padding: "12px 14px", borderBottom: `1px solid ${LINE}` }}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((b) => (
            <tr key={b.id} style={{ borderBottom: `1px solid ${LINE}` }}>
              <td style={{ padding: "11px 14px" }}>{b.date}</td><td style={{ padding: "11px 14px" }}>{b.time}</td><td style={{ padding: "11px 14px" }}>{b.name}</td>
              <td style={{ padding: "11px 14px", color: "#b9b2a4" }}>{b.email || "—"}<br />{b.phone}</td>
              <td style={{ padding: "11px 14px", color: GOLD }}>{b.reference}</td>
              <td style={{ padding: "11px 14px", color: STATUS[b.status]?.c }}>{b.status}</td>
              <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                {b.status === "pending" && <button disabled={busy === b.id} onClick={() => decide(b.id, "approve")} style={{ ...btn("#5aa06a", "#fff"), padding: "6px 12px", marginRight: 6 }}>Approve</button>}
                {b.status !== "declined" && <button disabled={busy === b.id} onClick={() => decide(b.id, "cancel")} style={{ ...btn("transparent", "#c98a7a"), padding: "6px 12px", border: "1px solid #6a4540" }}>Cancel</button>}
              </td>
            </tr>))}
            {rows.length === 0 && <tr><td colSpan={7} style={{ padding: 30, textAlign: "center", color: "#8c857a" }}>No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Availability — plain-language editor. Staff set OPENING HOURS per weekday
   (like Google Business hours) plus the consultation length; the bookable
   start-time slots are generated from those, previewed per day exactly as
   the website will offer them, and saved as the same config shape the
   backend already uses (timeSlots + openWeekdays + dayHours). Replaces the
   old comma-separated free-text fields, which silently broke the widget on
   any format slip ("9am" vs "9:00 AM"). */
const HOUR_OPTS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 AM … 8:00 PM
const fmtHour = (h: number) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? "AM" : "PM"}`;
const parseHour = (t: string): number | null => { const m = t.match(/^(\d+):(\d+)\s*([AP]M)$/i); if (!m) return null; return (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0); };
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon-first, like the store's own signage
const WD_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
type DayRow = { open: boolean; openH: number; closeH: number };

function Availability({ api }: { api: Api }) {
  const [cfg, setCfg] = useState<AvailabilityConfig | null>(null);
  const [days, setDays] = useState<DayRow[] | null>(null);
  const [blackouts, setBlackouts] = useState<string[]>([]);
  const [newDate, setNewDate] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api("/api/admin/config").then((d) => {
      const c: AvailabilityConfig = d.config;
      setCfg(c); setBlackouts(c.blackoutDates ?? []);
      // fallback hours for days without explicit dayHours: span of the master slot list
      const starts = (c.timeSlots ?? []).map(parseHour).filter((h): h is number => h !== null);
      const fbOpen = starts.length ? Math.min(...starts) : 9;
      const fbClose = starts.length ? Math.max(...starts) + Math.max(1, Math.ceil((c.slotDurationMin ?? 45) / 60)) : 17;
      setDays(Array.from({ length: 7 }, (_, wd) => ({
        open: (c.openWeekdays ?? []).includes(wd),
        openH: c.dayHours?.[wd]?.open ?? fbOpen,
        closeH: c.dayHours?.[wd]?.close ?? fbClose,
      })));
    }).catch(() => {});
  }, [api]);

  if (!cfg || !days) return <div style={{ color: "#8c857a" }}>Loading…</div>;
  const setCfgField = (patch: Partial<AvailabilityConfig>) => setCfg({ ...cfg, ...patch });
  const setDay = (wd: number, patch: Partial<DayRow>) => setDays(days.map((d, i) => (i === wd ? { ...d, ...patch } : d)));
  const durH = Math.max(15, cfg.slotDurationMin || 45) / 60;
  const slotsFor = (d: DayRow) => { const out: string[] = []; for (let h = d.openH; h + durH <= d.closeH; h++) out.push(fmtHour(h)); return out; };
  const longDateAU = (s: string) => new Date(s + "T00:00:00").toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const todayIso = iso(new Date());

  const addBlackout = () => { if (!newDate || blackouts.includes(newDate)) return; setBlackouts([...blackouts, newDate].sort()); setNewDate(""); };

  const save = async () => {
    const openRows = days.map((d, wd) => ({ ...d, wd })).filter((d) => d.open);
    if (!openRows.length) { setMsg("Open at least one day before saving."); return; }
    const bad = openRows.find((d) => slotsFor(d).length === 0);
    if (bad) { setMsg(`${WD_LONG[bad.wd]}: hours are too short to fit a ${cfg.slotDurationMin}-minute consultation.`); return; }
    // master slot list spans the widest open day; the website narrows it per-day via dayHours
    const minO = Math.min(...openRows.map((d) => d.openH));
    const maxC = Math.max(...openRows.map((d) => d.closeH));
    const timeSlots: string[] = [];
    for (let h = minO; h + durH <= maxC; h++) timeSlots.push(fmtHour(h));
    const next: AvailabilityConfig = {
      ...cfg, timeSlots,
      openWeekdays: openRows.map((d) => d.wd),
      dayHours: Object.fromEntries(openRows.map((d) => [d.wd, { open: d.openH, close: d.closeH }])),
      blackoutDates: blackouts,
    };
    setMsg("Saving…");
    try { await api("/api/admin/config", "PUT", next); setCfg(next); setMsg("Saved ✓ — the website calendar updates immediately."); }
    catch (e) { setMsg(e instanceof Error ? e.message : "error"); }
  };

  const hourSelect = (value: number, onChange: (h: number) => void, disabled: boolean) => (
    <select value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))}
      style={{ ...input, padding: "7px 9px", opacity: disabled ? 0.35 : 1, cursor: disabled ? "default" : "pointer" }}>
      {HOUR_OPTS.map((h) => <option key={h} value={h}>{fmtHour(h)}</option>)}
    </select>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24 }}>Availability</h2>

      <div style={card}>
        <label style={{ color: "#8c857a", fontSize: 13 }}>Opening hours — customers can book start times that finish before closing</label>
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {DAY_ORDER.map((wd) => {
            const d = days[wd];
            const preview = d.open ? slotsFor(d) : [];
            return (
              <div key={wd} style={{ display: "grid", gridTemplateColumns: "110px auto auto auto 1fr", gap: 10, alignItems: "center", padding: "8px 10px", borderRadius: 8, background: d.open ? "#1b1815" : "transparent", border: `1px solid ${d.open ? LINE : "transparent"}` }}>
                <button onClick={() => setDay(wd, { open: !d.open })}
                  style={{ ...btn(d.open ? GOLD : "transparent", d.open ? "#141312" : "#8c857a"), padding: "7px 0", border: d.open ? "none" : `1px solid ${LINE}`, textAlign: "center" }}>
                  {WD[wd]}
                </button>
                {d.open ? (
                  <>
                    {hourSelect(d.openH, (h) => setDay(wd, { openH: h, closeH: Math.max(d.closeH, h + 1) }), false)}
                    <span style={{ color: "#8c857a" }}>to</span>
                    {hourSelect(d.closeH, (h) => setDay(wd, { closeH: h, openH: Math.min(d.openH, h - 1) }), false)}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {preview.length
                        ? preview.map((t) => <span key={t} style={{ fontSize: 11, padding: "3px 7px", borderRadius: 5, border: `1px solid ${LINE}`, color: CREAM, background: BG }}>{t}</span>)
                        : <span style={{ fontSize: 12, color: "#e08a7a" }}>too short for a {cfg.slotDurationMin}-min consultation</span>}
                    </div>
                  </>
                ) : (
                  <span style={{ gridColumn: "2 / -1", color: "#8c857a", fontSize: 13 }}>Closed</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, color: "#8c857a", fontSize: 12 }}>
          Consultations start on the hour. The chips on the right are exactly the buttons customers will see for that day.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {([["slotDurationMin", "Consultation length (minutes)"], ["leadDays", "Minimum notice (days ahead)"], ["maxAdvanceDays", "Bookable window (days)"]] as const).map(([k, label]) => (
          <div key={k} style={card}><label style={{ color: "#8c857a", fontSize: 13 }}>{label}</label>
            <input type="number" style={{ ...input, width: "100%", marginTop: 6 }} value={cfg[k]} onChange={(e) => setCfgField({ [k]: Number(e.target.value) } as Partial<AvailabilityConfig>)} /></div>
        ))}
      </div>

      <div style={card}>
        <label style={{ color: "#8c857a", fontSize: 13 }}>Days off / holidays — these dates grey out on the website</label>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <input type="date" min={todayIso} value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ ...input, colorScheme: "dark" }} />
          <button style={{ ...btn(), opacity: newDate ? 1 : 0.4 }} onClick={addBlackout} disabled={!newDate}>Add day off</button>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: blackouts.length ? 12 : 0 }}>
          {blackouts.map((b) => (
            <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 12px", borderRadius: 999, border: `1px solid ${LINE}`, background: BG, color: CREAM, fontSize: 13 }}>
              {longDateAU(b)}
              <button aria-label={`Remove ${b}`} onClick={() => setBlackouts(blackouts.filter((x) => x !== b))}
                style={{ ...btn("transparent", "#e08a7a"), padding: "0 6px", fontSize: 15, border: "none" }}>×</button>
            </span>
          ))}
          {!blackouts.length && <span style={{ color: "#8c857a", fontSize: 13, marginTop: 8 }}>No days off scheduled.</span>}
        </div>
      </div>

      <div style={card}><label style={{ color: "#8c857a", fontSize: 13 }}>Location (shown in emails)</label>
        <input style={{ ...input, width: "100%", marginTop: 6, marginBottom: 12 }} value={cfg.location} onChange={(e) => setCfgField({ location: e.target.value })} />
        <label style={{ color: "#8c857a", fontSize: 13 }}>Directions URL</label>
        <input style={{ ...input, width: "100%", marginTop: 6 }} value={cfg.directionsUrl} onChange={(e) => setCfgField({ directionsUrl: e.target.value })} /></div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}><button style={btn()} onClick={save}>Save availability</button><span style={{ color: "#8c857a" }}>{msg}</span></div>
    </div>
  );
}

function TemplatesTab({ api }: { api: Api }) {
  const [templates, setTemplates] = useState<Templates | null>(null);
  const [versions, setVersions] = useState<TemplateVersions | null>(null);
  const [tkey, setTkey] = useState<EmailTemplateKey>("received");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const [msg, setMsg] = useState("");
  const [testTo, setTestTo] = useState("");
  const [vars, setVars] = useState<string[]>([]);
  const editor = useRef<HTMLIFrameElement>(null);
  const preview = useRef<HTMLIFrameElement>(null);

  const load = useCallback(() => api("/api/admin/templates").then((d) => { setTemplates(d.templates); setVersions(d.versions); setVars(d.variables); }).catch(() => {}), [api]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (templates) { setSubject(templates[tkey].subject); setHtml(templates[tkey].html); } }, [templates, tkey]);
  useEffect(() => { if (mode !== "visual") return; const ifr = editor.current; if (!ifr) return; const doc = ifr.contentDocument; if (!doc) return; doc.open(); doc.write(html || "<p></p>"); doc.close(); doc.designMode = "on"; /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode, tkey, templates]);

  const readEditor = () => (mode === "visual" && editor.current?.contentDocument) ? "<!doctype html>" + editor.current.contentDocument.documentElement.outerHTML : html;
  const exec = (cmd: string, val?: string) => { editor.current?.contentDocument?.execCommand(cmd, false, val); editor.current?.contentWindow?.focus(); };
  const switchMode = (m: "visual" | "html") => { if (m === "html") setHtml(readEditor()); setMode(m); };
  const save = async () => { setMsg("Saving…"); const finalHtml = readEditor(); setHtml(finalHtml); try { const d = await api("/api/admin/templates", "PUT", { key: tkey, subject, html: finalHtml }); setVersions((v) => v ? { ...v, [tkey]: d.versions } : v); setMsg("Saved as new version ✓"); } catch (e) { setMsg(e instanceof Error ? e.message : "error"); } };
  const doPreview = async () => { const d = await api("/api/admin/templates", "POST", { action: "preview", subject, html: readEditor() }); const ifr = preview.current; if (ifr?.contentDocument) { const doc = ifr.contentDocument; doc.open(); doc.write(d.html); doc.close(); } setMsg(`Preview subject: ${d.subject}`); };
  const revert = async (versionId: string) => { if (!confirm("Revert to this version? (current is snapshotted first)")) return; const d = await api("/api/admin/templates", "POST", { action: "revert", key: tkey, versionId }); setTemplates((t) => t ? { ...t, [tkey]: d.template } : t); setVersions((v) => v ? { ...v, [tkey]: d.versions } : v); setMsg("Reverted ✓"); };
  const test = async () => { setMsg("Sending test…"); try { const d = await api("/api/admin/templates", "POST", { action: "test", key: tkey, to: testTo, subject, html: readEditor() }); setMsg(`Test ${d.result.status} via ${d.result.provider}` + (d.result.error ? `: ${d.result.error}` : "")); } catch (e) { setMsg(e instanceof Error ? e.message : "error"); } };

  if (!templates) return <div style={{ color: "#8c857a" }}>Loading…</div>;
  const tb = (cmd: string, label: string, val?: string) => <button onClick={() => exec(cmd, val)} style={{ ...btn("#232019", CREAM), padding: "6px 10px", fontSize: 13, border: `1px solid ${LINE}` }}>{label}</button>;
  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, margin: 0 }}>Email templates</h2>
        {(["received", "confirmed"] as const).map((k) => <button key={k} onClick={() => setTkey(k)} style={{ ...btn(tkey === k ? GOLD : "transparent", tkey === k ? "#141312" : CREAM), border: tkey === k ? "none" : `1px solid ${LINE}` }}>{k === "received" ? "Booking received (pending)" : "Booking confirmed"}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <div style={card}><label style={{ color: "#8c857a", fontSize: 13 }}>Subject</label><input style={{ ...input, width: "100%", marginTop: 6 }} value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <div style={card}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
              <button onClick={() => switchMode("visual")} style={btn(mode === "visual" ? GOLD : "transparent", mode === "visual" ? "#141312" : CREAM)}>Visual</button>
              <button onClick={() => switchMode("html")} style={btn(mode === "html" ? GOLD : "transparent", mode === "html" ? "#141312" : CREAM)}>HTML</button>
              <span style={{ width: 1, height: 22, background: LINE }} />
              {mode === "visual" && <>{tb("bold", "B")}{tb("italic", "I")}{tb("underline", "U")}{tb("formatBlock", "H2", "h2")}{tb("insertUnorderedList", "• List")}
                <button onClick={() => { const u = prompt("Link URL"); if (u) exec("createLink", u); }} style={{ ...btn("#232019", CREAM), padding: "6px 10px", fontSize: 13, border: `1px solid ${LINE}` }}>Link</button>
                <select onChange={(e) => { if (e.target.value) exec("insertText", `{{${e.target.value}}}`); e.target.value = ""; }} style={{ ...input, padding: "6px 8px" }}><option value="">Insert variable…</option>{vars.map((v) => <option key={v} value={v}>{`{{${v}}}`}</option>)}</select></>}
            </div>
            {mode === "visual" ? <iframe ref={editor} title="editor" style={{ width: "100%", height: 520, border: `1px solid ${LINE}`, borderRadius: 8, background: "#fff" }} />
              : <textarea value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false} style={{ width: "100%", height: 520, border: `1px solid ${LINE}`, borderRadius: 8, background: BG, color: "#cfc6b8", fontFamily: "monospace", fontSize: 12, padding: 12 }} />}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button style={btn()} onClick={save}>Save version</button><button style={btn("#232019", CREAM)} onClick={doPreview}>Preview</button>
            <span style={{ width: 1, height: 22, background: LINE }} /><input placeholder="test@email.com" style={{ ...input, width: 200 }} value={testTo} onChange={(e) => setTestTo(e.target.value)} /><button style={btn("#232019", CREAM)} onClick={test}>Send test</button>
            <span style={{ color: "#8c857a", fontSize: 13 }}>{msg}</span>
          </div>
        </div>
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div style={card}><div style={{ color: GOLD, fontSize: 13, marginBottom: 8 }}>Version history</div>
            <div style={{ display: "grid", gap: 6, maxHeight: 260, overflow: "auto" }}>{(versions?.[tkey] ?? []).map((v) => (
              <div key={v.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, borderBottom: `1px solid ${LINE}`, paddingBottom: 6 }}>
                <span style={{ color: "#b9b2a4" }}>{new Date(v.savedAt).toLocaleString()}<br /><span style={{ color: "#6f675c" }}>{v.note}</span></span>
                <button onClick={() => revert(v.id)} style={{ ...btn("transparent", GOLD), border: `1px solid ${LINE}`, padding: "4px 10px" }}>Revert</button></div>))}
              {(versions?.[tkey]?.length ?? 0) === 0 && <span style={{ color: "#6f675c", fontSize: 12 }}>No versions yet — saving an edit creates one.</span>}</div></div>
          <div style={card}><div style={{ color: GOLD, fontSize: 13, marginBottom: 8 }}>Live preview</div>
            <iframe ref={preview} title="preview" style={{ width: "100%", height: 360, border: `1px solid ${LINE}`, borderRadius: 8, background: BG }} />
            <div style={{ color: "#6f675c", fontSize: 11, marginTop: 6 }}>Click &ldquo;Preview&rdquo; to render with sample data.</div></div>
        </div>
      </div>
    </div>
  );
}

function Outbox({ api }: { api: Api }) {
  const [rows, setRows] = useState<OutboxEntry[]>([]);
  const [provider, setProvider] = useState("");
  const [open, setOpen] = useState<OutboxEntry | null>(null);
  useEffect(() => { api("/api/admin/outbox").then((d) => { setRows(d.outbox); setProvider(d.provider); }).catch(() => {}); }, [api]);
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24 }}>Email outbox <span style={{ color: "#8c857a", fontSize: 14 }}>· {provider}{provider === "outbox" ? " (queued only — set SMTP_* or RESEND_API_KEY for real delivery)" : " · live delivery"}</span></h2>
      <div style={{ ...card, marginTop: 14, padding: 0, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ textAlign: "left", color: "#8c857a" }}>{["Time", "To", "Subject", "Template", "Status", ""].map((h) => <th key={h} style={{ padding: "12px 14px", borderBottom: `1px solid ${LINE}` }}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((o) => (
            <tr key={o.id} style={{ borderBottom: `1px solid ${LINE}` }}>
              <td style={{ padding: "10px 14px", color: "#b9b2a4" }}>{new Date(o.createdAt).toLocaleString()}</td><td style={{ padding: "10px 14px" }}>{o.to}</td>
              <td style={{ padding: "10px 14px" }}>{o.subject}</td><td style={{ padding: "10px 14px", color: GOLD }}>{o.template}</td>
              <td style={{ padding: "10px 14px", color: o.status === "sent" ? "#5aa06a" : o.status === "error" ? "#a05a5a" : GOLD }}>{o.status}</td>
              <td style={{ padding: "10px 14px" }}><button style={{ ...btn("transparent", CREAM), border: `1px solid ${LINE}`, padding: "5px 10px" }} onClick={() => setOpen(o)}>View</button></td></tr>))}
            {rows.length === 0 && <tr><td colSpan={6} style={{ padding: 30, textAlign: "center", color: "#8c857a" }}>No emails yet.</td></tr>}</tbody>
        </table>
      </div>
      {open && <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 640, maxWidth: "92%", maxHeight: "88vh", background: INK, border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: 14, borderBottom: `1px solid ${LINE}`, display: "flex", justifyContent: "space-between" }}><b>{open.subject}</b><button onClick={() => setOpen(null)} style={btn("transparent", CREAM)}>✕</button></div>
          <iframe title="mail" srcDoc={open.html} style={{ flex: 1, border: "none", background: "#fff", minHeight: 400 }} /></div></div>}
    </div>
  );
}
