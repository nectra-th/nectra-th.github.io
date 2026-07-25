"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ArrowLeft, ArrowRight, Clock, Mail } from "../icons";

/* Interactive booking widget matching the Figma multi-step design (1180×496 card).
   Three steps that swap inside the same card footprint:
     select  — checklist | calendar | times, with a "Continue" button
     details — checklist | Your Booking Request card | Enter Your Details form
     success — Your Booking Summary | Thank You confirmation
   Colours/sizes taken from the Figma "IDLE STATE" and the details/summary states. */

const TIME_SLOTS = ["9:00AM", "10:00AM", "11:00AM", "12:00PM", "1:00PM", "2:00PM", "3:00PM", "4:00PM"];
const SLOT_HOURS_24 = [9, 10, 11, 12, 13, 14, 15, 16];
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CHECKLIST = [
  "Meet one-on-one with the jeweller",
  "30 - 45 minutes consultation",
  "Bring sketches, photos or inspiration",
  "Discuss gemstones, metals and budget",
  "No obligation or sales pressure",
];
const HEAR_OPTIONS = ["Google search", "Instagram", "Facebook", "Word of mouth", "Walked past the store", "Other"];

// Static/demo build (GitHub Pages) has no booking backend.
const DEMO = process.env.NEXT_PUBLIC_DEMO === "1";

const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const slotIndex = (t: string) => TIME_SLOTS.indexOf(t);
const spaceTime = (t: string) => t.replace(/(AM|PM)$/, " $1"); // "9:00AM" -> "9:00 AM"
const ordinal = (d: number) => { const s = ["th", "st", "nd", "rd"], v = d % 100; return d + (s[(v - 20) % 10] || s[v] || s[0]); };

type Status = "idle" | "submitting" | "error";
type Step = "select" | "details" | "success";

const FONT = "var(--font-manrope), system-ui, sans-serif";
const H3 = { fontFamily: FONT, fontSize: 28, fontWeight: 600, lineHeight: "28px", color: "var(--color-ink-text)", margin: 0 } as const;
const SUB = { fontFamily: FONT, fontSize: 16, lineHeight: "24px", color: "var(--color-body)", marginTop: 16 } as const;

export default function BookingWidget({ stacked = false, cardWidth = 1180 }: { stacked?: boolean; cardWidth?: number }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [step, setStep] = useState<Step>("select");
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [taken, setTaken] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", hear: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // On the static GitHub Pages build there is no backend, so skip the fetch and
  // let the widget run as a self-contained demo (every slot appears available).
  useEffect(() => { if (DEMO) return; fetch("/api/bookings").then((r) => r.json()).then((d) => setTaken(d.taken ?? {})).catch(() => {}); }, []);

  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: { day: number; inMonth: boolean; date: Date | null }[] = [];
    for (let i = 0; i < lead; i++) out.push({ day: new Date(view.y, view.m, 1 - (lead - i)).getDate(), inMonth: false, date: null });
    for (let d = 1; d <= daysInMonth; d++) out.push({ day: d, inMonth: true, date: new Date(view.y, view.m, d) });
    let next = 1;
    while (out.length % 7 !== 0) out.push({ day: next++, inMonth: false, date: null });
    return out;
  }, [view]);

  const dateDisabled = (d: Date | null) => !d || d < today; // weekends allowed

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const d = new Date(selectedDate + "T00:00:00");
    const takenForDate = taken[selectedDate] ?? [];
    const now = new Date();
    const isToday = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    return TIME_SLOTS.map((t) => ({ t, disabled: takenForDate.includes(t) || (isToday && SLOT_HOURS_24[slotIndex(t)] <= now.getHours()) }));
  }, [selectedDate, taken]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const detailsValid = !!selectedDate && !!selectedTime && form.name.trim().length >= 2 && emailOk &&
    form.phone.replace(/[^\d]/g, "").length >= 8 && consent && status !== "submitting";

  // dynamic labels for the request / summary rows
  const dObj = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
  const reqDate = dObj ? `${WEEKDAYS_LONG[dObj.getDay()]}, ${ordinal(dObj.getDate())} of ${MONTHS_LONG[dObj.getMonth()]}` : "";
  const sumDate = dObj ? `${WEEKDAYS_LONG[dObj.getDay()]}, ${dObj.getDate()} ${MONTHS_LONG[dObj.getMonth()]} ${dObj.getFullYear()}` : "";
  const prettyTime = selectedTime ? spaceTime(selectedTime) : "";

  async function submit() {
    if (!detailsValid) return;
    setStatus("submitting"); setMessage("");
    // Demo (static) build: no API — briefly show "submitting" then confirm.
    if (DEMO) { setStatus("idle"); setStep("success"); return; }
    try {
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: selectedDate, time: selectedTime, name: form.name, email: form.email, phone: form.phone, notes: form.hear }) });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error"); setMessage(data.error ?? "Something went wrong.");
        if (res.status === 409 && selectedDate && selectedTime) { setTaken((p) => ({ ...p, [selectedDate]: [...(p[selectedDate] ?? []), selectedTime] })); }
        return;
      }
      setStatus("idle"); setStep("success");
    } catch { setStatus("error"); setMessage("Network error. Please try again."); }
  }

  function reset() {
    setStep("select"); setSelectedDate(null); setSelectedTime(null);
    setForm({ name: "", email: "", phone: "", hear: "" }); setConsent(false); setStatus("idle"); setMessage("");
  }

  // The 3-column layout is a fixed 1180px design. On a narrower card (tablet
  // island 807px) render it at 1180 and scale to fit, exactly like the Figma
  // tablet booking (which is the desktop card scaled down). Mobile stacks.
  const scale = stacked ? 1 : Math.min(1, cardWidth / 1180);
  const scaled = scale < 0.999;
  const cardChrome = {
    borderRadius: 18, background: "rgba(248,243,234,0.94)", boxShadow: "0 20px 60px -20px rgba(20,19,18,0.25)",
    backdropFilter: "blur(4px)", padding: stacked ? "28px 24px" : "40px 49px", fontFamily: FONT,
  } as const;
  const cardBase: React.CSSProperties = scaled
    ? { position: "absolute", top: 0, left: 0, width: 1180, minHeight: 496, transform: `scale(${scale})`, transformOrigin: "top left", ...cardChrome }
    : { position: "absolute", inset: 0, height: stacked ? "auto" : "100%", minHeight: stacked ? "100%" : undefined, ...cardChrome };

  /* shared checklist column */
  const Checklist = (
    <div>
      <h3 style={H3}>Preparing for Your<br />Design Consultation</h3>
      <p style={SUB}>Everything you need before we meet.</p>
      <ul style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
        {CHECKLIST.map((c) => (
          <li key={c} style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
            <Check style={{ width: 22, height: 22, flex: "0 0 auto", color: "var(--color-gold)" }} />
            <span style={{ fontFamily: FONT, fontSize: 16, color: "var(--color-ink-text)", whiteSpace: stacked ? "normal" : "nowrap" }}>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  // ---- SUCCESS STEP ----------------------------------------------------------
  if (step === "success") {
    const SUM = [sumDate, prettyTime, "30-45 Minutes", "In-Person Consultation"];
    return (
      <div style={{ ...cardBase, zIndex: 20 }}>
        <button aria-label="Close" onClick={reset} style={{ position: "absolute", top: stacked ? 20 : 32, right: stacked ? 20 : 36, width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-gold)", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent" }}>
          <XIcon />
        </button>
        <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : "300px 1fr", columnGap: 40, rowGap: 28, height: "100%", alignItems: "center" }}>
          {/* left — summary */}
          <div>
            <h3 style={{ ...H3, fontSize: 26 }}>Your Booking Summary</h3>
            <ul style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 24 }}>
              {SUM.map((s, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Check style={{ flex: "0 0 auto", width: 26, height: 26, color: "var(--color-gold)" }} />
                  <span style={{ fontSize: 17, color: "var(--color-ink-text)" }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* right — thank you */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ width: 60, height: 60, borderRadius: "50%", border: "1.5px solid var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check style={{ width: 30, height: 30, color: "var(--color-gold)" }} />
            </span>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 46, fontWeight: 600, lineHeight: "1", color: "var(--color-ink-text)", margin: "18px 0 0" }}>Thank You!</h2>
            <p style={{ fontSize: 16, color: "var(--color-ink-text)", marginTop: 14 }}>Your consultation request has been received.</p>
            <p style={{ fontSize: 15, lineHeight: "22px", color: "var(--color-body)", marginTop: 10, maxWidth: 420 }}>Grech Jewellers will review your preferred date and time and contact you to confirm your appointment.</p>
            <span style={{ marginTop: 18, borderRadius: 999, border: "1px solid var(--color-gold)", padding: "9px 22px", fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-gold)" }}>Pending Confirmation</span>
            <div style={{ width: "100%", height: 1, background: "var(--color-gold)", opacity: 0.5, margin: "26px 0 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ flex: "0 0 auto", width: 40, height: 40, borderRadius: "50%", border: "1.5px solid var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)" }}>
                <Mail style={{ width: 18, height: 18 }} />
              </span>
              <span style={{ fontSize: 15, color: "var(--color-ink-text)" }}>A request receipt has been sent to your email/whatsapp</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- DETAILS STEP ----------------------------------------------------------
  if (step === "details") {
    const reqRows = [reqDate, `${prettyTime} (30-45 minutes)`, "30-45 minutes", "In-person Consultation"];
    return (
      <div style={{ ...cardBase, zIndex: 20 }}>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: stacked ? "1fr" : "323px 328px 334px", columnGap: 48, rowGap: stacked ? 28 : 0, height: "100%" }}>
          {!stacked && <div style={{ position: "absolute", left: 348, top: 8, width: 1, height: 400, background: "var(--color-divider)" }} />}
          {!stacked && <div style={{ position: "absolute", left: 724, top: 8, width: 1, height: 400, background: "var(--color-divider)" }} />}

          {Checklist}

          {/* middle — back arrow + Your Booking Request + consent */}
          <div>
            <button aria-label="Back" onClick={() => setStep("select")} style={{ width: 44, height: 44, borderRadius: 8, border: "1px solid var(--color-gold)", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent" }}>
              <ArrowLeft style={{ width: 18, height: 18 }} />
            </button>
            <div style={{ marginTop: 18, background: "#fff", borderRadius: 12, padding: "22px 24px", boxShadow: "0 8px 24px -16px rgba(20,19,18,0.35)" }}>
              <h4 style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: "var(--color-ink-text)", margin: 0 }}>Your Booking Request</h4>
              <ul style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
                {reqRows.map((r, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Clock style={{ width: 19, height: 19, flex: "0 0 auto", color: "var(--color-gold)" }} />
                    <span style={{ fontSize: 15, color: "var(--color-ink-text)" }}>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <label style={{ marginTop: 18, display: "flex", gap: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ flex: "0 0 auto", width: 18, height: 18, marginTop: 2, accentColor: "var(--color-gold)" }} />
              <span style={{ fontSize: 14, lineHeight: "20px", color: "var(--color-ink-text)" }}>I understand this is a consultation request and Grech Jewellers will contact me to confirm a suitable appointment time.</span>
            </label>
          </div>

          {/* right — Enter Your Details form */}
          <div>
            <h3 style={{ ...H3, textAlign: stacked ? "left" : "right" }}>Enter Your Details</h3>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your name" />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="Email Address" />
              <div>
                <FieldLabel>Contact Number*</FieldLabel>
                <div style={{ display: "flex" }}>
                  <span style={{ display: "flex", alignItems: "center", padding: "0 14px", height: 44, border: "1px solid var(--color-line)", borderRight: "none", borderRadius: "8px 0 0 8px", background: "#fff", fontSize: 14, color: "var(--color-ink-text)" }}>AUS</span>
                  <input type="tel" value={form.phone} placeholder="0412 345 678" onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    style={{ flex: 1, minWidth: 0, height: 44, border: "1px solid var(--color-line)", borderRadius: "0 8px 8px 0", background: "#fff", padding: "0 14px", fontSize: 14, color: "var(--color-ink-text)", outline: "none" }} />
                </div>
              </div>
              <div>
                <FieldLabel>How did you hear about us?</FieldLabel>
                <div style={{ position: "relative" }}>
                  <select value={form.hear} onChange={(e) => setForm((f) => ({ ...f, hear: e.target.value }))}
                    style={{ appearance: "none", width: "100%", height: 44, border: "1px solid var(--color-line)", borderRadius: 8, background: "#fff", padding: "0 38px 0 14px", fontSize: 14, color: form.hear ? "var(--color-ink-text)" : "var(--color-body)", outline: "none", cursor: "pointer" }}>
                    <option value="" disabled>Select an option</option>
                    {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-body)" }}><Chevron /></span>
                </div>
              </div>
              {status === "error" && <p style={{ borderRadius: 8, background: "#fef2f2", padding: "10px 14px", fontSize: 13, color: "#b91c1c" }}>{message}</p>}
              <button onClick={submit} disabled={!detailsValid}
                style={{ marginTop: 4, height: 48, borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: "0.04em",
                  background: detailsValid ? "var(--color-gold)" : "#dcd1be", color: detailsValid ? "var(--color-ink)" : "rgba(87,87,87,0.5)",
                  cursor: detailsValid ? "pointer" : "default", border: "none" }}>
                {status === "submitting" ? "Sending…" : "Request Consultation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- SELECT STEP -----------------------------------------------------------
  const canContinue = !!selectedDate && !!selectedTime;
  const timeSlots: { t: string; disabled: boolean; preview?: boolean }[] = selectedDate ? availableTimes : TIME_SLOTS.map((t) => ({ t, disabled: false, preview: true }));
  return (
    <div style={cardBase}>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: stacked ? "1fr" : "323px 328px 334px", columnGap: 48, rowGap: stacked ? 28 : 0 }}>
        {!stacked && <div style={{ position: "absolute", left: 348, top: 111, width: 1, height: 256, background: "var(--color-divider)" }} />}
        {!stacked && <div style={{ position: "absolute", left: 724, top: 111, width: 1, height: 256, background: "var(--color-divider)" }} />}

        {Checklist}

        {/* Calendar */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ ...H3, fontWeight: 700 }}>Choose Your Date</h3>
          <p style={SUB}>Select a day that suits you</p>
          <div style={{ marginTop: 38 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, height: 32 }}>
              <button aria-label="Previous month" onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, color: "var(--color-ink-text)" }}><ArrowLeft style={{ width: 16, height: 16 }} /></button>
              <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.02em", color: "var(--color-ink-text)" }}>{MONTHS[view.m]} {view.y}</span>
              <button aria-label="Next month" onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 8, color: "var(--color-ink-text)" }}><ArrowRight style={{ width: 16, height: 16 }} /></button>
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(7,1fr)", textAlign: "center" }}>
              {WEEKDAYS.map((w) => (<span key={w} style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.02em", color: "var(--color-body)", opacity: 0.7 }}>{w}</span>))}
            </div>
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: "48px", placeItems: "center" }}>
              {cells.map((c, idx) => {
                const dateStr = c.date ? iso(view.y, view.m, c.day) : null;
                const disabled = dateDisabled(c.date);
                const selected = dateStr && dateStr === selectedDate;
                const isToday = !!c.date && c.date.getTime() === today.getTime();
                return (
                  <button key={idx} disabled={!c.inMonth || disabled} onClick={() => { if (dateStr) { setSelectedDate(dateStr); setSelectedTime(null); setStatus("idle"); } }}
                    style={{
                      width: 40, height: 40, borderRadius: "50%", fontSize: 15,
                      color: !c.inMonth ? "rgba(87,87,87,0.25)" : disabled ? "rgba(87,87,87,0.3)" : selected ? "var(--color-ink)" : "var(--color-ink-text)",
                      textDecoration: c.inMonth && disabled ? "line-through" : "none",
                      background: selected ? "var(--color-gold)" : "transparent",
                      fontWeight: selected ? 600 : 400,
                      boxShadow: isToday && !selected ? "inset 0 0 0 1px rgba(181,138,71,0.5)" : "none",
                      cursor: !c.inMonth || disabled ? "default" : "pointer",
                    }}>{c.day}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Times — heading/sub right-aligned to the card edge (per Figma) */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ ...H3, fontWeight: 700, textAlign: stacked ? "left" : "right" }}>Select a Time</h3>
          <p style={{ ...SUB, textAlign: stacked ? "left" : "right" }}>Available Appointments</p>
          <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 14, rowGap: 12 }}>
            {timeSlots.map(({ t, disabled, preview }) => {
              const on = selectedTime === t;
              return (
                <button key={t} disabled={disabled || preview} onClick={() => setSelectedTime(t)}
                  style={{
                    height: 46, borderRadius: 8, fontSize: 15,
                    border: `1px solid ${on ? "var(--color-gold)" : preview || disabled ? "#e1ddd4" : "var(--color-line)"}`,
                    background: on ? "var(--color-gold)" : "transparent",
                    color: on ? "var(--color-ink)" : preview || disabled ? "rgba(87,87,87,0.4)" : "var(--color-ink-text)",
                    textDecoration: disabled && !preview ? "line-through" : "none",
                    fontWeight: on ? 600 : 400,
                    cursor: disabled || preview ? "default" : "pointer",
                  }}>{t}</button>
              );
            })}
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock style={{ width: 16, height: 16, flex: "0 0 auto", color: "var(--color-gold)" }} />
            <span style={{ fontSize: 14, color: "var(--color-body)" }}>30-45 minute consultation</span>
          </div>
          <button onClick={() => canContinue && setStep("details")} disabled={!canContinue}
            style={{ marginTop: 14, width: "100%", height: 46, borderRadius: 8, fontSize: 14, fontWeight: 600, letterSpacing: "0.04em",
              background: canContinue ? "var(--color-gold)" : "#dcd1be", color: canContinue ? "var(--color-ink)" : "rgba(87,87,87,0.5)",
              cursor: canContinue ? "pointer" : "default", border: "none" }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span style={{ marginBottom: 6, display: "block", fontSize: 13, fontWeight: 500, color: "var(--color-ink-text)" }}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label style={{ display: "block" }}>
      <FieldLabel>{label}</FieldLabel>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", height: 44, borderRadius: 8, border: "1px solid var(--color-line)", background: "#fff", padding: "0 14px", fontSize: 14, color: "var(--color-ink-text)", outline: "none" }} />
    </label>
  );
}

function Chevron() {
  return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
}
function XIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>);
}
