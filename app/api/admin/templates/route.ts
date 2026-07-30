import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getAllVersions, getTemplates, revertTemplate, saveTemplate } from "@/lib/booking-db";
import { deliver, render } from "@/lib/email";
import type { EmailTemplateKey, TemplateVars } from "@/lib/booking-types";

export const dynamic = "force-dynamic";

const SAMPLE: TemplateVars = {
  name: "Matthew Falzun", email: "matt@example.com", phone: "0412 345 678",
  date: "Wednesday 14 October", time: "10:30 AM", project: "Engagement Ring",
  reference: "GJ-240714-1842", duration: "45 minutes",
  location: "Grech Jewellers, West Lakes Shopping Centre",
  directionsUrl: "https://maps.google.com/",
};
const KEYS: EmailTemplateKey[] = ["received", "confirmed"];
const validKey = (k: unknown): k is EmailTemplateKey => k === "received" || k === "confirmed";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ templates: await getTemplates(), versions: await getAllVersions(), variables: Object.keys(SAMPLE) });
}

// PUT { key, subject, html } → save (snapshots previous version first)
export async function PUT(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { key, subject, html, note } = (await req.json().catch(() => ({}))) as { key?: string; subject?: string; html?: string; note?: string };
  if (!validKey(key) || typeof subject !== "string" || typeof html !== "string")
    return NextResponse.json({ error: "key, subject, html required" }, { status: 400 });
  const tpl = await saveTemplate(key, subject, html, note);
  return NextResponse.json({ ok: true, template: tpl, versions: (await getAllVersions())[key] });
}

// POST { action: "revert"|"test"|"preview", ... }
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = body.action;

  if (action === "preview") {
    const subject = render(String(body.subject ?? ""), SAMPLE);
    const html = render(String(body.html ?? ""), SAMPLE);
    return NextResponse.json({ subject, html });
  }
  if (action === "revert") {
    if (!validKey(body.key) || typeof body.versionId !== "string")
      return NextResponse.json({ error: "key, versionId required" }, { status: 400 });
    const tpl = await revertTemplate(body.key, body.versionId);
    if (!tpl) return NextResponse.json({ error: "Version not found" }, { status: 404 });
    return NextResponse.json({ ok: true, template: tpl, versions: (await getAllVersions())[body.key] });
  }
  if (action === "test") {
    const to = String(body.to ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return NextResponse.json({ error: "A valid recipient email is required." }, { status: 400 });
    const result = await deliver({
      to,
      subject: render(String(body.subject ?? ""), SAMPLE),
      html: render(String(body.html ?? ""), SAMPLE),
      template: "test",
    });
    return NextResponse.json({ ok: result.ok, result });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
