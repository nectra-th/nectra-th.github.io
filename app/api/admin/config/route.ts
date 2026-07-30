import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getConfig, setConfig } from "@/lib/booking-db";
import type { AvailabilityConfig } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ config: await getConfig() });
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const patch = (await req.json().catch(() => ({}))) as Partial<AvailabilityConfig>;
  // light sanitising of the array fields
  if (patch.openWeekdays) patch.openWeekdays = patch.openWeekdays.filter((d) => d >= 0 && d <= 6);
  if (patch.timeSlots) patch.timeSlots = patch.timeSlots.map((s) => String(s).trim()).filter(Boolean);
  if (patch.blackoutDates) patch.blackoutDates = patch.blackoutDates.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  return NextResponse.json({ ok: true, config: await setConfig(patch) });
}
