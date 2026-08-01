"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ArrowLeft, ArrowRight, Clock, Mail, Calendar, Timer, User } from "../icons";

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

export default function BookingWidget({ stacked = false, compact = false, cardWidth = 1180 }: { stacked?: boolean; compact?: boolean; cardWidth?: number }) {
  // `compact` is tablet only (768–1023px, still 3-column via `stacked=false`
  // but with Figma's own much smaller internal type: headings 20px not 28px,
  // sub-text 11px not 16px, calendar/time labels ~10px not 15px — verified
  // against the tablet IDLE STATE directly. Mobile and desktop share the
  // same (larger) scale, confirmed identical against their own references.
  const H3 = { fontFamily: FONT, fontSize: compact ? 20 : 28, fontWeight: 600, lineHeight: compact ? "22px" : "28px", color: "var(--color-ink-text)", margin: 0 } as const;
  const SUB = { fontFamily: FONT, fontSize: compact ? 11 : 16, lineHeight: compact ? "16px" : "24px", color: "var(--color-body)", marginTop: compact ? 11 : 16 } as const;
  const [step, setStep] = useState<Step>("select");
  // `today` / `view` depend on the current date, which differs between build time
  // (this island is prerendered) and the visitor's runtime — deriving them during
  // render would cause a hydration mismatch. Resolve them after mount instead, so
  // the server and first client render are identical (an empty calendar frame).
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  useEffect(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    setToday(d); setView({ y: d.getFullYear(), m: d.getMonth() });
  }, []);
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

  // move focus to the confirmation heading when the request succeeds
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (step === "success") successRef.current?.focus(); }, [step]);

  const cells = useMemo(() => {
    const out: { day: number; inMonth: boolean; date: Date | null }[] = [];
    if (!view) return out;
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    for (let i = 0; i < lead; i++) out.push({ day: new Date(view.y, view.m, 1 - (lead - i)).getDate(), inMonth: false, date: null });
    for (let d = 1; d <= daysInMonth; d++) out.push({ day: d, inMonth: true, date: new Date(view.y, view.m, d) });
    let next = 1;
    while (out.length % 7 !== 0) out.push({ day: next++, inMonth: false, date: null });
    return out;
  }, [view]);

  const dateDisabled = (d: Date | null) => !d || !today || d < today; // weekends allowed

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const d = new Date(selectedDate + "T00:00:00");
    const takenForDate = taken[selectedDate] ?? [];
    const now = new Date();
    const isToday = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    // taken slots come back from the API in the canonical spaced form ("9:00 AM")
    return TIME_SLOTS.map((t) => ({ t, disabled: takenForDate.includes(spaceTime(t)) || (isToday && SLOT_HOURS_24[slotIndex(t)] <= now.getHours()) }));
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
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: selectedDate, time: spaceTime(selectedTime ?? ""), name: form.name, email: form.email, phone: form.phone, notes: form.hear }) });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error"); setMessage(data.error ?? "Something went wrong.");
        if (res.status === 409 && selectedDate && selectedTime) { setTaken((p) => ({ ...p, [selectedDate]: [...(p[selectedDate] ?? []), spaceTime(selectedTime)] })); }
        return;
      }
      setStatus("idle"); setStep("success");
    } catch { setStatus("error"); setMessage("Network error. Please try again."); }
  }

  function reset() {
    setStep("select"); setSelectedDate(null); setSelectedTime(null);
    setForm({ name: "", email: "", phone: "", hear: "" }); setConsent(false); setStatus("idle"); setMessage("");
  }

  // Fluid card: three equal columns on wide screens, a single stacked column on
  // narrow screens (mobile). Layout is real CSS grid — no fixed width or scaling.
  // (`cardWidth` kept for API compatibility but no longer drives the layout.)
  void cardWidth;
  const cardChrome = {
    borderRadius: 18, background: "rgba(248,243,234,0.9)", border: "1px solid #d8cbb7", boxShadow: "0 20px 60px -20px rgba(20,19,18,0.25)",
    backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", padding: stacked ? "26px 20px" : compact ? "27px 34px" : "40px 44px", fontFamily: FONT,
  } as const;
  // 470 is desktop's own natural content height, kept as one shared floor
  // across steps so the card doesn't resize when switching (select/details/
  // success). At compact the select step (the taller of the two, since it's
  // fully content-driven regardless of minHeight — verified by testing with
  // minHeight:0) only naturally needs 376, not 470 — the unscaled desktop
  // value was leaving 94–188px of true empty space below the card content.
  const cardBase: React.CSSProperties = { position: "relative", width: "100%", minHeight: stacked ? undefined : compact ? 376 : 470, ...cardChrome };
  // divider x-positions for 3 equal columns (1fr each) with a 40px column gap
  // (33px at tablet compact — Figma's own itemSpacing there, verified against
  // the tablet IDLE STATE node tree, not just a scaled-down guess).
  const COL_GAP = compact ? 33 : 40;
  const DIV1 = compact ? "calc((100% - 66px) / 3 + 16px)" : "calc((100% - 80px) / 3 + 20px)";
  const DIV2 = compact ? "calc((100% - 66px) / 3 * 2 + 49px)" : "calc((100% - 80px) / 3 * 2 + 60px)";

  /* shared checklist column */
  const Checklist = (
    <div>
      <h3 style={{ ...H3, textAlign: stacked ? "center" : undefined, lineHeight: stacked ? "38px" : H3.lineHeight }}>Preparing for Your<br />Design Consultation</h3>
      <p style={{ ...SUB, textAlign: stacked ? "center" : undefined }}>Everything you need before we meet.</p>
      <ul style={{ marginTop: stacked ? 8 : compact ? 33 : 48, display: "flex", flexDirection: "column", gap: compact ? 16 : 24 }}>
        {CHECKLIST.map((c) => (
          <li key={c} style={{ display: "flex", alignItems: "center", gap: compact ? 5 : 6, height: compact ? 16 : 24 }}>
            <Check style={{ width: compact ? 16 : 24, height: compact ? 16 : 24, flex: "0 0 auto", color: "var(--color-gold)" }} />
            <span style={{ fontFamily: FONT, fontSize: compact ? 11 : 16, fontWeight: 500, color: "var(--color-ink-text)", whiteSpace: stacked ? "normal" : "nowrap" }}>{c}</span>
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
        <button aria-label="Close" onClick={reset} className="gj-soft" style={{ position: "absolute", top: stacked ? 20 : 32, right: stacked ? 20 : 36, width: 40, height: 40, borderRadius: "50%", border: "1px solid #d2b79a", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent" }}>
          <XIcon />
        </button>
        <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : "minmax(0,300px) 1fr", columnGap: 40, rowGap: 28, alignItems: "center" }}>
          {/* left — summary */}
          <div>
            <h3 style={{ ...H3, fontSize: compact ? 19 : 26 }}>Your Booking Summary</h3>
            <ul style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 24 }}>
              {SUM.map((s, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Check style={{ flex: "0 0 auto", width: 40, height: 40, color: "var(--color-gold)" }} />
                  <span style={{ fontSize: 17, color: "var(--color-ink-text)" }}>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* right — thank you */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid #b38952", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check style={{ width: 30, height: 30, color: "var(--color-gold)" }} />
            </span>
            <h3 ref={successRef} tabIndex={-1} style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 48, fontWeight: 700, lineHeight: "1", color: "var(--color-ink-text)", margin: "18px 0 0", outline: "none" }}>Thank You!</h3>
            <p style={{ fontSize: 16, color: "var(--color-ink-text)", marginTop: 14 }}>Your consultation request has been received.</p>
            <p style={{ fontSize: 15, lineHeight: "22px", color: "var(--color-body)", marginTop: 10, maxWidth: 420 }}>Grech Jewellers will review your preferred date and time and contact you to confirm your appointment.</p>
            <span style={{ marginTop: 18, borderRadius: 999, border: "1px solid #d7bf97", background: "#f5ecdc", padding: "9px 22px", fontSize: 13, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-gold)" }}>Pending Confirmation</span>
            <div style={{ width: "100%", height: 1, background: "var(--color-gold)", opacity: 0.5, margin: "26px 0 20px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ flex: "0 0 auto", width: 40, height: 40, borderRadius: "50%", border: "1px solid var(--color-gold-dark)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)" }}>
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
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: stacked ? "1fr" : "1fr 1fr 1fr", columnGap: COL_GAP, rowGap: stacked ? 28 : 0 }}>
          {/* same top/height as the select step's dividers (Figma-verified
              against the checklist column, which is the identical shared
              component in both steps) — the lines must not shift when the
              step changes, only the middle/right column content swaps. */}
          {!stacked && <div style={{ position: "absolute", left: DIV1, top: compact ? 76 : 111, width: 1, height: compact ? 175 : 256, background: "var(--color-divider)" }} />}
          {!stacked && <div style={{ position: "absolute", left: DIV2, top: compact ? 76 : 111, width: 1, height: compact ? 175 : 256, background: "var(--color-divider)" }} />}

          {Checklist}

          {/* middle — back arrow + Your Booking Request + consent */}
          <div>
            <button aria-label="Back" onClick={() => setStep("select")} className="gj-soft" style={{ width: compact ? 27 : 40, height: compact ? 27 : 40, borderRadius: 8, border: "1px solid var(--color-divider)", color: "var(--color-gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent" }}>
              <ArrowLeft style={{ width: compact ? 12 : 18, height: compact ? 12 : 18 }} />
            </button>
            {/* card scale below uses the same ~0.684 tablet:desktop ratio
                verified against Figma's IDLE STATE elsewhere in this widget
                (font sizes, gaps, divider heights) — this step's own DETAILS
                STATE wasn't fetched for tablet (API rate-limited), so these
                are proportionally derived, not directly measured. */}
            <div style={{ marginTop: compact ? 14 : 20, background: "#fff", borderRadius: 8, padding: compact ? "15px 16px" : "22px 24px", boxShadow: "0 8px 24px -16px rgba(20,19,18,0.35)" }}>
              <h4 style={{ fontFamily: FONT, fontSize: compact ? 16 : 22, fontWeight: 600, color: "var(--color-ink-text)", margin: 0 }}>Your Booking Request</h4>
              <ul style={{ marginTop: compact ? 12 : 18, display: "flex", flexDirection: "column", gap: compact ? 11 : 16 }}>
                {reqRows.map((r, i) => {
                  // per-row icons matching the Figma "Your Booking Request" card:
                  // date → calendar, time → clock, duration → timer, type → person
                  const Icon = [Calendar, Clock, Timer, User][i] ?? Clock;
                  return (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 12 }}>
                      <Icon style={{ width: compact ? 13 : 19, height: compact ? 13 : 19, flex: "0 0 auto", color: "var(--color-gold)" }} />
                      <span style={{ fontSize: compact ? 10 : 15, color: "var(--color-ink-text)" }}>{r}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <label style={{ marginTop: compact ? 12 : 18, display: "flex", gap: compact ? 8 : 12, cursor: "pointer" }}>
              <span style={{ position: "relative", flex: "0 0 auto", width: compact ? 16 : 24, height: compact ? 16 : 24, marginTop: 2 }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                  style={{ position: "absolute", inset: 0, margin: 0, width: compact ? 16 : 24, height: compact ? 16 : 24, opacity: 0, cursor: "pointer" }} />
                <span aria-hidden style={{
                  display: "flex", alignItems: "center", justifyContent: "center", width: compact ? 16 : 24, height: compact ? 16 : 24, borderRadius: 2,
                  background: consent ? "var(--color-gold-dark)" : "var(--color-cream)",
                  border: `1px solid ${consent ? "var(--color-gold-dark)" : "var(--color-divider)"}`,
                }}>
                  {consent && <svg width={compact ? 10 : 14} height={compact ? 10 : 14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 13 10 18 19 7" /></svg>}
                </span>
              </span>
              <span style={{ fontSize: compact ? 10 : 14, lineHeight: compact ? "14px" : "20px", color: "var(--color-ink-text)" }}>I understand this is a consultation request and Grech Jewellers will contact me to confirm a suitable appointment time.</span>
            </label>
          </div>

          {/* right — Enter Your Details form */}
          <div>
            <h3 style={{ ...H3, textAlign: stacked ? "left" : "right" }}>Enter Your Details</h3>
            <div style={{ marginTop: stacked ? 24 : compact ? 19 : 32, display: "flex", flexDirection: "column", gap: compact ? 5 : 8 }}>
              <Field label="Name *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Your name" showLabel={false} compact={compact} />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="Email Address" showLabel={false} compact={compact} />
              <div>
                <div style={{ display: "flex" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: compact ? "0 8px" : "0 12px", height: compact ? 30 : 44, border: "1px solid var(--color-divider)", borderRight: "none", borderRadius: "8px 0 0 8px", background: "var(--color-cream-light)" }}>
                    <span role="img" aria-label="Australia" style={{ width: compact ? 18 : 26, height: compact ? 14 : 20, borderRadius: 2, backgroundImage: "url(/assets/flag-au.png)", backgroundSize: "cover", backgroundPosition: "center" }} />
                  </span>
                  <input type="tel" aria-label="Contact number" value={form.phone} placeholder="0412 345 678" onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="gj-field"
                    style={{ flex: 1, minWidth: 0, height: compact ? 30 : 44, border: "1px solid var(--color-divider)", borderRadius: "0 8px 8px 0", background: "var(--color-cream-light)", padding: compact ? "0 10px" : "0 14px", fontSize: compact ? 10 : 14, color: "#403b37", outline: "none" }} />
                </div>
              </div>
              <div>
                <FieldLabel compact={compact}>How did you hear about us?</FieldLabel>
                <div style={{ position: "relative" }}>
                  <select aria-label="How did you hear about us?" value={form.hear} onChange={(e) => setForm((f) => ({ ...f, hear: e.target.value }))} className="gj-field"
                    style={{ appearance: "none", width: "100%", height: compact ? 30 : 44, border: "1px solid var(--color-divider)", borderRadius: 8, background: "var(--color-cream-light)", padding: compact ? "0 26px 0 10px" : "0 38px 0 14px", fontSize: compact ? 10 : 14, color: form.hear ? "#403b37" : "var(--color-body)", outline: "none", cursor: "pointer" }}>
                    <option value="" disabled>Select an option</option>
                    {HEAR_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: compact ? 10 : 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-body)" }}><Chevron size={compact ? 10 : 14} /></span>
                </div>
              </div>
              {/* error floats above the button (absolute) so it never pushes the
                  button down / grows the card */}
              <div style={{ position: "relative", marginTop: compact ? 16 : 24 }}>
                {status === "error" && <p role="alert" style={{ position: "absolute", left: 0, right: 0, bottom: "calc(100% + 8px)", margin: 0, borderRadius: 8, background: "#fef2f2", padding: compact ? "5px 8px" : "8px 12px", fontSize: compact ? 9 : 13, lineHeight: compact ? "13px" : "18px", color: "#b91c1c", boxShadow: "0 8px 20px -10px rgba(0,0,0,0.35)" }}>{message}</p>}
                <button className="gj-primary" onClick={submit} disabled={!detailsValid}
                  style={{ width: "100%", height: compact ? 33 : 48, borderRadius: 8, fontSize: compact ? 10 : 14, fontWeight: 600, letterSpacing: "0.04em",
                    background: detailsValid ? "#b88c46" : "#d8cbb7", color: detailsValid ? "var(--color-ink)" : "rgba(87,87,87,0.5)",
                    cursor: detailsValid ? "pointer" : "default", border: "none" }}>
                  {status === "submitting" ? "Sending…" : "Request Consultation"}
                </button>
              </div>
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
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: stacked ? "1fr" : "1fr 1fr 1fr", columnGap: COL_GAP, rowGap: stacked ? 20 : 0 }}>
        {!stacked && <div style={{ position: "absolute", left: DIV1, top: compact ? 76 : 111, width: 1, height: compact ? 175 : 256, background: "var(--color-divider)" }} />}
        {!stacked && <div style={{ position: "absolute", left: DIV2, top: compact ? 76 : 111, width: 1, height: compact ? 175 : 256, background: "var(--color-divider)" }} />}

        {Checklist}

        {/* Calendar */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ ...H3, fontWeight: 700 }}>Choose Your Date</h3>
          <p style={SUB}>Select a day that suits you</p>
          <div style={{ marginTop: stacked ? 16 : compact ? 33 : 48 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: compact ? "center" : "space-between", gap: compact ? 38 : undefined, maxWidth: compact ? undefined : 252, margin: "0 auto", height: compact ? 24 : 32 }}>
              <button aria-label="Previous month" onClick={() => setView((v) => (v ? (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }) : v))} className="gj-navarrow" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: compact ? 24 : 32, height: compact ? 24 : 32, borderRadius: 0, border: "1px solid var(--color-divider)", background: "var(--color-cream-light)", color: "var(--color-gold-dark)", cursor: "pointer", flex: "0 0 auto" }}><ArrowLeft style={{ width: compact ? 11 : 15, height: compact ? 11 : 15 }} /></button>
              <span style={{ fontSize: compact ? 10 : 16, fontWeight: 500, letterSpacing: "0.02em", color: "var(--color-ink-text)", width: compact ? 88 : undefined, textAlign: compact ? "center" : undefined, flex: "0 0 auto" }}>{view ? `${MONTHS[view.m]} ${view.y}` : " "}</span>
              <button aria-label="Next month" onClick={() => setView((v) => (v ? (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }) : v))} className="gj-navarrow" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: compact ? 24 : 32, height: compact ? 24 : 32, borderRadius: 0, border: "1px solid var(--color-divider)", background: "var(--color-cream-light)", color: "var(--color-gold-dark)", cursor: "pointer", flex: "0 0 auto" }}><ArrowRight style={{ width: compact ? 11 : 15, height: compact ? 11 : 15 }} /></button>
            </div>
            <div style={{ marginTop: stacked ? 10 : compact ? 0 : 8, display: "grid", gridTemplateColumns: "repeat(7,1fr)", alignItems: "center", height: compact ? 27 : undefined, textAlign: "center" }}>
              {WEEKDAYS.map((w) => (<span key={w} style={{ fontSize: compact ? 8.5 : 12, fontWeight: 500, letterSpacing: "0.02em", color: "var(--color-body)", opacity: 0.7 }}>{w}</span>))}
            </div>
            <div style={{ marginTop: stacked ? 8 : 0, display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridAutoRows: compact ? "27px" : "40px", columnGap: compact ? 5 : 8, rowGap: compact ? 3 : 8, placeItems: "center", minHeight: compact ? 160 : 232 }}>
              {cells.map((c, idx) => {
                const dateStr = c.date && view ? iso(view.y, view.m, c.day) : null;
                const disabled = dateDisabled(c.date);
                const selected = dateStr && dateStr === selectedDate;
                const isToday = !!c.date && !!today && c.date.getTime() === today.getTime();
                const dayLabel = c.date ? `${WEEKDAYS_LONG[c.date.getDay()]}, ${c.date.getDate()} ${MONTHS_LONG[c.date.getMonth()]} ${c.date.getFullYear()}` : undefined;
                return (
                  <button key={idx} className={"gj-soft" + (c.inMonth && !disabled && !selected ? " gj-datecell" : "")} disabled={!c.inMonth || disabled}
                    aria-label={dayLabel} aria-pressed={!!selected} aria-current={isToday ? "date" : undefined}
                    onClick={() => { if (dateStr) { setSelectedDate(dateStr); setSelectedTime(null); setStatus("idle"); } }}
                    style={{
                      width: compact ? 27 : 40, height: compact ? 27 : 40, borderRadius: "50%", fontSize: compact ? 10 : 15,
                      color: !c.inMonth ? "rgba(98,91,82,0.45)" : disabled ? "#625b52" : selected ? "#f8f3ea" : isToday ? "var(--color-ink-text)" : "#403b37",
                      background: selected ? "#b88c46" : "transparent",
                      fontWeight: 400,
                      boxShadow: isToday && !selected ? "inset 0 0 0 1px var(--color-divider)" : "none",
                      cursor: !c.inMonth || disabled ? "default" : "pointer",
                    }}>{c.day}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Times — heading/sub right-aligned to the card edge (per Figma) */}
        <div style={{ textAlign: "center" }}>
          <h3 style={{ ...H3, fontWeight: 700, textAlign: stacked ? "center" : "right" }}>Select a Time</h3>
          <p style={{ ...SUB, textAlign: stacked ? "center" : "right" }}>Available Appointments</p>
          <div style={{ marginTop: stacked ? 16 : compact ? 33 : 48, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: compact ? 6 : 14, rowGap: compact ? 6 : 10 }}>
            {timeSlots.map(({ t, disabled, preview }) => {
              const on = selectedTime === t;
              return (
                <button key={t} className={"gj-soft" + (!on && !disabled && !preview ? " gj-timeslot" : "")} disabled={disabled || preview} aria-pressed={on} aria-label={`${spaceTime(t)}${disabled && !preview ? " (unavailable)" : ""}`} onClick={() => setSelectedTime(t)}
                  style={{
                    height: stacked ? 42 : compact ? 31 : 46, borderRadius: 0, fontSize: compact ? 10 : 15,
                    border: `1px solid ${on ? "#b88c46" : "var(--color-divider)"}`,
                    background: on ? "#b88c46" : disabled ? "var(--color-cream-card)" : "var(--color-cream-light)",
                    color: on ? "#ede5d7" : preview || disabled ? "var(--color-line)" : "#403b37",
                    textDecoration: disabled && !preview ? "line-through" : "none",
                    fontWeight: 400,
                    cursor: disabled || preview ? "default" : "pointer",
                  }}>{t}</button>
              );
            })}
          </div>
          {/* not in Figma's IDLE STATE at all (that column ends exactly at the
             time-slot grid, no extra room) — shown only once a time is picked,
             so the empty/undecided card matches Figma's height exactly. */}
          {canContinue && (
            <>
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
                <Clock style={{ width: 16, height: 16, flex: "0 0 auto", color: "var(--color-gold)" }} />
                <span style={{ fontSize: compact ? 11 : 14, color: "var(--color-body)" }}>30-45 minute consultation</span>
              </div>
              <button className="gj-primary" onClick={() => setStep("details")}
                style={{ marginTop: 14, width: "100%", height: 46, borderRadius: 8, fontSize: compact ? 12 : 14, fontWeight: 600, letterSpacing: "0.04em",
                  background: "#b88c46", color: "var(--color-ink)", cursor: "pointer", border: "none" }}>
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return <span style={{ marginBottom: compact ? 4 : 6, display: "block", fontSize: compact ? 9 : 13, fontWeight: 500, color: "#625b52" }}>{children}</span>;
}

function Field({ label, value, onChange, type = "text", placeholder, showLabel = true, compact = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; showLabel?: boolean; compact?: boolean }) {
  return (
    <label style={{ display: "block" }}>
      {showLabel && <FieldLabel compact={compact}>{label}</FieldLabel>}
      <input type={type} value={value} placeholder={placeholder} aria-label={showLabel ? undefined : label} onChange={(e) => onChange(e.target.value)} className="gj-field"
        style={{ width: "100%", height: compact ? 30 : 44, borderRadius: 8, border: "1px solid var(--color-divider)", background: "var(--color-cream-light)", padding: compact ? "0 10px" : "0 14px", fontSize: compact ? 10 : 14, color: "#403b37", outline: "none" }} />
    </label>
  );
}

function Chevron({ size = 14 }: { size?: number }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
}
function XIcon() {
  return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>);
}
