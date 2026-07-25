"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button, Container, Eyebrow } from "./ui";
import { ArrowLeft, ArrowRight, Check } from "./icons";
import Reveal from "./Reveal";

const TIME_SLOTS = [
  "9:00AM", "10:00AM", "11:00AM", "12:00PM",
  "1:00PM", "2:00PM", "3:00PM", "4:00PM",
];
const SLOT_HOURS_24 = [9, 10, 11, 12, 13, 14, 15, 16];
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];
const CHECKLIST = [
  "Meet one-on-one with the jeweller",
  "30 - 45 minutes consultation",
  "Bring sketches, photos or inspiration",
  "Discuss gemstones, metals and budget",
  "No obligation or sales pressure",
];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function slotIndex(t: string) {
  return TIME_SLOTS.indexOf(t);
}

type Status = "idle" | "submitting" | "success" | "error";

export default function Booking() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [taken, setTaken] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => setTaken(d.taken ?? {}))
      .catch(() => {});
  }, []);

  // Build the calendar grid (Monday-first, 6 weeks).
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const lead = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const out: { day: number; inMonth: boolean; date: Date | null }[] = [];
    for (let i = 0; i < lead; i++) {
      const d = new Date(view.y, view.m, 1 - (lead - i));
      out.push({ day: d.getDate(), inMonth: false, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      out.push({ day: d, inMonth: true, date: new Date(view.y, view.m, d) });
    }
    while (out.length % 7 !== 0 || out.length < 42) {
      const idx = out.length - (lead + daysInMonth) + 1;
      out.push({ day: new Date(view.y, view.m + 1, idx).getDate(), inMonth: false, date: null });
      if (out.length >= 42) break;
    }
    return out;
  }, [view]);

  const isPast = (d: Date) => d < today;
  const isSunday = (d: Date) => d.getDay() === 0;
  const dateDisabled = (d: Date | null) => !d || isPast(d) || isSunday(d);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const d = new Date(selectedDate + "T00:00:00");
    let slots = TIME_SLOTS;
    if (d.getDay() === 6) slots = TIME_SLOTS.slice(0, 4); // Saturday 9–1
    const takenForDate = taken[selectedDate] ?? [];
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    return slots.map((t) => {
      const hour24 = SLOT_HOURS_24[slotIndex(t)];
      const past = isToday && hour24 <= now.getHours();
      return { t, disabled: takenForDate.includes(t) || past };
    });
  }, [selectedDate, taken]);

  const canSubmit =
    selectedDate &&
    selectedTime &&
    form.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.phone.replace(/[^\d]/g, "").length >= 8 &&
    status !== "submitting";

  const prettyDate = selectedDate
    ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-AU", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "";

  async function submit() {
    if (!canSubmit) return;
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, time: selectedTime, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        if (res.status === 409 && selectedDate && selectedTime) {
          setTaken((prev) => ({
            ...prev,
            [selectedDate]: [...(prev[selectedDate] ?? []), selectedTime],
          }));
          setSelectedTime(null);
        }
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="booking" className="relative overflow-hidden bg-cream py-20 md:py-16 lg:pt-[244px] lg:pb-[150px]">
      <Container className="relative">
        {/* Intro + consultation image */}
        <Reveal className="grid grid-cols-1 items-end gap-10 md:grid-cols-[1fr_0.95fr]">
          <div>
            <Eyebrow>Book A Design Consultation</Eyebrow>
            <h2 className="mt-4 font-serif text-[1.95rem] font-semibold leading-[1.08] text-ink-text md:text-[2.3rem] lg:text-[3.1rem]">
              Every Meaningful
              <br />
              Piece Begins With
              <br />
              A Conversation
            </h2>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-body md:text-base">
              Meet directly with the jeweller to discuss your ideas, explore
              options and receive honest, obligation-free advice tailored to you.
            </p>
          </div>
          <div className="group relative hidden aspect-[16/10] w-full overflow-hidden rounded-lg shadow-xl md:block">
            <Image src="/assets/booking-consult.jpg" alt="A design consultation in progress" fill className="object-cover transition-transform duration-500 ease-out group-hover:scale-105" sizes="560px" />
          </div>
        </Reveal>

        {/* Booking widget */}
        <Reveal delay={100} className="mt-10 rounded-2xl bg-cream-light p-6 shadow-xl lg:p-10">
          {status === "success" ? (
            <SuccessPanel
              name={form.name}
              date={prettyDate}
              time={selectedTime ?? ""}
              onReset={() => {
                setStatus("idle");
                setSelectedDate(null);
                setSelectedTime(null);
                setForm({ name: "", email: "", phone: "", notes: "" });
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.05fr_0.85fr] lg:gap-10">
                {/* Checklist */}
                <div className="md:border-r md:border-line/60 md:pr-8">
                  <h3 className="font-sans text-2xl font-semibold text-ink-text">
                    Preparing for Your Design Consultation
                  </h3>
                  <p className="mt-2 text-[15px] text-body">Everything you need before we meet.</p>
                  <ul className="mt-6 space-y-4">
                    {CHECKLIST.map((c) => (
                      <li key={c} className="flex items-center gap-3">
                        <Check className="h-5 w-5 shrink-0 text-gold" />
                        <span className="text-[15px] font-medium text-ink-text">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Calendar */}
                <div className="md:border-r md:border-line/60 md:pr-8">
                  <h3 className="font-sans text-2xl font-bold text-ink-text">Choose Your Date</h3>
                  <p className="mt-2 text-[15px] text-body">Select a day that suits you</p>

                  <div className="mt-6">
                    <div className="flex items-center justify-between px-1">
                      <button
                        aria-label="Previous month"
                        onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-text transition-[background-color,color,transform] duration-200 ease-out hover:bg-cream hover:text-gold active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <span className="text-[15px] font-medium tracking-wide text-ink-text">
                        {MONTHS[view.m]} {view.y}
                      </span>
                      <button
                        aria-label="Next month"
                        onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-ink-text transition-[background-color,color,transform] duration-200 ease-out hover:bg-cream hover:text-gold active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-7 gap-y-2 text-center">
                      {WEEKDAYS.map((w) => (
                        <span key={w} className="text-[11px] font-medium tracking-wide text-body/70">{w}</span>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-y-1.5 text-center">
                      {cells.map((c, idx) => {
                        const dateStr = c.date ? iso(view.y, view.m, c.day) : null;
                        const disabled = dateDisabled(c.date);
                        const selected = dateStr && dateStr === selectedDate;
                        const isToday = !!c.date && c.date.getTime() === today.getTime();
                        return (
                          <div key={idx} className="flex justify-center">
                            <button
                              disabled={!c.inMonth || disabled}
                              onClick={() => {
                                if (dateStr) {
                                  setSelectedDate(dateStr);
                                  setSelectedTime(null);
                                  setStatus("idle");
                                }
                              }}
                              className={[
                                "flex h-9 w-9 md:h-8 md:w-8 lg:h-9 lg:w-9 items-center justify-center rounded-full text-[14px] transition-[background-color,color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                                !c.inMonth ? "text-body/25" : "",
                                c.inMonth && disabled ? "text-body/30 line-through" : "",
                                c.inMonth && !disabled && !selected ? "text-ink-text hover:bg-cream hover:text-gold-dark active:scale-90" : "",
                                isToday && !selected ? "ring-1 ring-gold/50" : "",
                                selected ? "bg-gold text-ink font-semibold shadow-sm shadow-gold/40" : "",
                              ].join(" ")}
                            >
                              {c.day}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Times */}
                <div>
                  <h3 className="font-sans text-2xl font-bold text-ink-text">Select a Time</h3>
                  <p className="mt-2 text-[15px] text-body">Available Appointments</p>
                  {!selectedDate ? (
                    <p className="mt-6 text-[14px] italic text-body/70">Choose a date first to see available times.</p>
                  ) : availableTimes.length === 0 ? (
                    <p className="mt-6 text-[14px] italic text-body/70">No appointments available on this day.</p>
                  ) : (
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {availableTimes.map(({ t, disabled }) => (
                        <button
                          key={t}
                          disabled={disabled}
                          onClick={() => setSelectedTime(t)}
                          className={[
                            "rounded-md border py-3 text-[14px] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
                            disabled
                              ? "cursor-not-allowed border-line/50 text-body/30 line-through"
                              : selectedTime === t
                              ? "-translate-y-0.5 border-gold bg-gold text-ink font-semibold shadow-sm shadow-gold/30"
                              : "border-line text-ink-text hover:-translate-y-0.5 hover:border-gold hover:text-gold-dark hover:shadow-sm active:translate-y-0",
                          ].join(" ")}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact form — revealed once date + time chosen */}
              {selectedDate && selectedTime && (
                <div className="mt-8 border-t border-line/60 pt-8">
                  <p className="text-[15px] text-body">
                    Booking a consultation for{" "}
                    <span className="font-semibold text-ink-text">{prettyDate}</span> at{" "}
                    <span className="font-semibold text-ink-text">{selectedTime}</span>. Just a few details:
                  </p>
                  <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Field label="Full name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Jane Smith" />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} placeholder="jane@example.com" />
                    <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} placeholder="0400 000 000" />
                  </div>
                  <div className="mt-4">
                    <Field label="What are you looking to create? (optional)" value={form.notes} onChange={(v) => setForm((f) => ({ ...f, notes: v }))} placeholder="e.g. a custom engagement ring" />
                  </div>

                  {status === "error" && (
                    <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-[14px] text-red-700">{message}</p>
                  )}

                  <div className="mt-6">
                    <Button onClick={submit} variant="gold" className={`min-w-[190px] ${!canSubmit ? "cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none" : ""}`}>
                      {status === "submitting" ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
                          Booking…
                        </span>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Reveal>
      </Container>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-wide text-body">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-line bg-white px-4 py-3 text-[15px] text-ink-text outline-none transition duration-200 hover:border-line/80 focus:border-gold focus:shadow-sm focus:ring-2 focus:ring-gold/25"
      />
    </label>
  );
}

function SuccessPanel({
  name, date, time, onReset,
}: {
  name: string; date: string; time: string; onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="flex h-16 w-16 animate-pop-in items-center justify-center rounded-full bg-gold/15">
        <Check className="h-9 w-9 text-gold" />
      </div>
      <h3 className="mt-6 font-serif text-3xl font-semibold text-ink-text">Thank you, {name.split(" ")[0]}!</h3>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-body">
        Your design consultation is booked for{" "}
        <span className="font-semibold text-ink-text">{date}</span> at{" "}
        <span className="font-semibold text-ink-text">{time}</span>. We&rsquo;ve noted your
        request and look forward to meeting you. A member of our team will be in
        touch to confirm.
      </p>
      <button onClick={onReset} className="mt-8 text-[13px] font-semibold uppercase tracking-[0.1em] text-gold transition-colors duration-200 hover:text-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light">
        Book another appointment
      </button>
    </div>
  );
}
