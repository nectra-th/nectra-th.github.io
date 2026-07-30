import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { adminCreateBooking, decideBooking, getBookings, getConfig, SlotTakenError } from "@/lib/booking-db";
import { sendBookingEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const bookings = (await getBookings()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ bookings });
}

// PATCH { id, action: "approve" | "decline" | "cancel" }
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, action } = (await req.json().catch(() => ({}))) as { id?: string; action?: string };
  if (!id || !["approve", "decline", "cancel"].includes(action ?? ""))
    return NextResponse.json({ error: "id and action (approve|decline|cancel) required" }, { status: 400 });

  const booking = await decideBooking(id, action === "approve" ? "confirmed" : "declined");
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  let email = null;
  if (action === "approve" && booking.email) email = await sendBookingEmail("confirmed", booking);
  return NextResponse.json({ ok: true, booking, email });
}

// POST → admin creates a booking (walk-in / phone). Body: date,time,name,phone,
// email?, project?, notes?, status? (default "confirmed"), force?, sendEmail?
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const date = String(b.date ?? "").trim();
  const time = String(b.time ?? "").trim();
  const name = String(b.name ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const email = String(b.email ?? "").trim();
  const project = String(b.project ?? "").trim().slice(0, 120);
  const notes = String(b.notes ?? "").trim().slice(0, 500);
  const status = (["pending", "confirmed", "declined"].includes(String(b.status)) ? b.status : "confirmed") as "pending" | "confirmed" | "declined";
  const force = b.force === true;
  const sendEmail = b.sendEmail === true;

  const cfg = await getConfig();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "A valid date is required." }, { status: 400 });
  if (!cfg.timeSlots.includes(time)) return NextResponse.json({ error: "That time slot isn't configured." }, { status: 400 });
  if (name.length < 2) return NextResponse.json({ error: "A name is required." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 6) return NextResponse.json({ error: "A phone number is required." }, { status: 400 });

  try {
    const booking = await adminCreateBooking({ date, time, name, phone, email, project, notes, status }, force);
    let mail = null;
    if (sendEmail && email && (status === "confirmed" || status === "pending"))
      mail = await sendBookingEmail(status === "confirmed" ? "confirmed" : "received", booking);
    return NextResponse.json({ ok: true, booking, email: mail }, { status: 201 });
  } catch (err) {
    if (err instanceof SlotTakenError) return NextResponse.json({ error: "That slot is already booked. Turn on “allow overlap” to add anyway." }, { status: 409 });
    return NextResponse.json({ error: "Could not create the booking." }, { status: 500 });
  }
}
