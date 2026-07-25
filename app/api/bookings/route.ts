import { NextResponse } from "next/server";
import { addBooking, getTakenSlots, SlotTakenError } from "@/lib/bookings";

// Never prerender — always read fresh booking data.
export const dynamic = "force-dynamic";

const TIME_SLOTS = [
  "9:00AM",
  "10:00AM",
  "11:00AM",
  "12:00PM",
  "1:00PM",
  "2:00PM",
  "3:00PM",
  "4:00PM",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const taken = await getTakenSlots();
  return NextResponse.json({ taken });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const date = typeof b.date === "string" ? b.date.trim() : "";
  const time = typeof b.time === "string" ? b.time.trim() : "";
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const notes = typeof b.notes === "string" ? b.notes.trim().slice(0, 500) : "";

  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push("A valid date is required.");
  if (!TIME_SLOTS.includes(time)) errors.push("A valid time slot is required.");
  if (name.length < 2) errors.push("Please enter your name.");
  if (!EMAIL_RE.test(email)) errors.push("Please enter a valid email address.");
  if (phone.replace(/[^\d]/g, "").length < 8) errors.push("Please enter a valid phone number.");

  // Reject dates in the past.
  const chosen = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!Number.isNaN(chosen.getTime()) && chosen < today) {
    errors.push("Please choose a date in the future.");
  }
  // Weekends are selectable (booking is a request the store confirms later),
  // so no weekday restriction here — keep in sync with the calendar.

  if (errors.length) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  try {
    const booking = await addBooking({ date, time, name, email, phone, notes });
    return NextResponse.json(
      { ok: true, booking: { id: booking.id, date: booking.date, time: booking.time } },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof SlotTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
