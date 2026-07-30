import { NextResponse } from "next/server";
import { createBooking, getAvailability, getConfig, SlotTakenError } from "@/lib/booking-db";
import { sendBookingEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET → availability for the public calendar (open weekdays, slots, taken map…)
export async function GET() {
  const a = await getAvailability();
  // keep the legacy shape (`taken`) working for the current widget
  return NextResponse.json({ taken: a.taken, availability: a });
}

// POST → create a PENDING booking + send the "received" email.
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const b = body as Record<string, unknown>;
  const date = typeof b.date === "string" ? b.date.trim() : "";
  // normalise the time so "9:00AM" / "9:00 am" all become the canonical "9:00 AM"
  const time = (typeof b.time === "string" ? b.time.trim() : "").replace(/(\d)\s*([AaPp][Mm])\b/, (_m, d, ap) => `${d} ${ap.toUpperCase()}`);
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const project = typeof b.project === "string" ? b.project.trim().slice(0, 120) : "";
  const notes = typeof (b.notes ?? b.hear) === "string" ? String(b.notes ?? b.hear).trim().slice(0, 500) : "";

  const cfg = await getConfig();
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("A valid date is required.");
  if (!cfg.timeSlots.includes(time)) errors.push("A valid time slot is required.");
  if (name.length < 2) errors.push("Please enter your name.");
  if (!EMAIL_RE.test(email)) errors.push("Please enter a valid email address.");
  if (phone.replace(/[^\d]/g, "").length < 8) errors.push("Please enter a valid phone number.");

  const chosen = new Date(date + "T00:00:00");
  if (!Number.isNaN(chosen.getTime())) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const earliest = new Date(today); earliest.setDate(earliest.getDate() + cfg.leadDays);
    const latest = new Date(today); latest.setDate(latest.getDate() + cfg.maxAdvanceDays);
    if (chosen < earliest) errors.push("Please choose a date further ahead.");
    if (chosen > latest) errors.push("That date is too far in advance.");
    if (!cfg.openWeekdays.includes(chosen.getDay())) errors.push("We're closed on that day. Please pick another.");
    if (cfg.blackoutDates.includes(date)) errors.push("That date is unavailable. Please pick another.");
  }
  if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

  try {
    const booking = await createBooking({ date, time, name, email, phone, project, notes });
    // fire the "received / pending approval" email (never block the response on it)
    sendBookingEmail("received", booking).catch(() => {});
    return NextResponse.json(
      { ok: true, booking: { id: booking.id, reference: booking.reference, date: booking.date, time: booking.time, status: booking.status } },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof SlotTakenError) return NextResponse.json({ error: err.message }, { status: 409 });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
