import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getOutbox } from "@/lib/booking-db";
import { emailProvider } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ outbox: await getOutbox(), provider: emailProvider() });
}
