import { addOutbox, getTemplate, getConfig } from "./booking-db";
import type { Booking, EmailTemplateKey, TemplateVars } from "./booking-types";
import type { AvailabilityConfig } from "./booking-types";

const RESEND_KEY = process.env.RESEND_API_KEY ?? "";
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Grech Jewellers <onboarding@resend.dev>";

// Domain-free SMTP fallback (e.g. Gmail + App Password). Set SMTP_HOST/USER/PASS
// to send real mail without registering/verifying a sending domain. For Gmail:
//   SMTP_HOST=smtp.gmail.com  SMTP_PORT=587  SMTP_USER=you@gmail.com  SMTP_PASS=<16-char app password>
const SMTP_HOST = process.env.SMTP_HOST ?? "";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER ?? "";
const SMTP_PASS = process.env.SMTP_PASS ?? "";
// Gmail rewrites From to the authenticated user, so default the From to SMTP_USER.
const SMTP_FROM = process.env.SMTP_FROM || (SMTP_USER ? `Grech Jewellers <${SMTP_USER}>` : "");
const SMTP_OK = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

/** Replace every {{var}} token; unknown tokens collapse to "". */
export function render(tpl: string, vars: Partial<TemplateVars>): string {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_m, k: string) => {
    const v = (vars as Record<string, unknown>)[k];
    return v == null ? "" : String(v);
  });
}

export function prettyDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });
}

export function buildVars(b: Booking, cfg: AvailabilityConfig): TemplateVars {
  return {
    name: b.name,
    email: b.email,
    phone: b.phone,
    date: prettyDate(b.date),
    time: b.time,
    project: b.project || "—",
    reference: b.reference,
    duration: `${cfg.slotDurationMin} minutes`,
    location: cfg.location,
    directionsUrl: cfg.directionsUrl,
  };
}

type Provider = "resend" | "smtp" | "outbox";
type SendResult = { ok: boolean; provider: Provider; status: "sent" | "queued" | "error"; error?: string };

/** Deliver via Resend (if a key is set), else SMTP (if configured), else queue
 *  into the Outbox so the flow still completes and every message stays auditable
 *  in the admin. A real send that fails is also recorded in the Outbox as an error. */
export async function deliver(args: {
  to: string; subject: string; html: string; template: EmailTemplateKey | "test" | "notify"; bookingId?: string;
}): Promise<SendResult> {
  const provider: Provider = RESEND_KEY ? "resend" : SMTP_OK ? "smtp" : "outbox";
  let status: "sent" | "queued" | "error" = provider === "outbox" ? "queued" : "sent";
  let error: string | undefined;

  if (provider === "resend") {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: EMAIL_FROM, to: [args.to], subject: args.subject, html: args.html }),
      });
      if (!res.ok) { status = "error"; error = `Resend ${res.status}: ${(await res.text()).slice(0, 200)}`; }
    } catch (e) {
      status = "error"; error = e instanceof Error ? e.message : "send failed";
    }
  } else if (provider === "smtp") {
    try {
      // dynamic import so nodemailer is only pulled in when SMTP is actually used
      const nodemailer = (await import("nodemailer")).default;
      const transport = nodemailer.createTransport({
        host: SMTP_HOST, port: SMTP_PORT, secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transport.sendMail({ from: SMTP_FROM, to: args.to, subject: args.subject, html: args.html });
    } catch (e) {
      status = "error"; error = e instanceof Error ? e.message : "smtp send failed";
    }
  }

  await addOutbox({ to: args.to, subject: args.subject, html: args.html, template: args.template, bookingId: args.bookingId, provider, status, error });
  return { ok: status !== "error", provider, status, error };
}

// Internal notification to the store for every new customer request (per
// request from the store — they shouldn't have to poll the admin page).
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "jeweller@grechjewellers.com.au";
const ADMIN_URL = process.env.ADMIN_URL ?? "https://grech-jewellers.vercel.app/admin";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Plain internal heads-up to the store inbox — deliberately simple (no
 *  brand shell, not an editable template): row of facts + a link to the
 *  admin where Accept/Decline actually happens. Customer-entered values are
 *  escaped before being embedded in the HTML. */
export async function sendStoreNotification(booking: Booking): Promise<SendResult> {
  const cfg = await getConfig();
  const v = buildVars(booking, cfg);
  const row = (label: string, value: string) =>
    `<tr><td style="padding:7px 18px 7px 0;color:#6f675c;font-size:13px;white-space:nowrap;">${label}</td><td style="padding:7px 0;color:#1c1a18;font-size:14px;"><b>${value}</b></td></tr>`;
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f2ec;font-family:Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e2dccf;border-radius:10px;padding:26px 30px;">
<tr><td>
  <div style="font-size:18px;color:#1c1a18;"><b>New consultation request</b></div>
  <div style="font-size:13px;color:#6f675c;margin-top:4px;">A customer just booked on the website — awaiting your approval.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;border-collapse:collapse;">
    ${row("Name", esc(booking.name))}
    ${row("Phone", esc(booking.phone))}
    ${row("Email", esc(booking.email))}
    ${row("Requested", `${v.date} at ${v.time}`)}
    ${row("Reference", booking.reference)}
  </table>
  <a href="${ADMIN_URL}" style="display:inline-block;margin-top:20px;background:#b88c46;color:#141312;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 22px;border-radius:8px;">Open the booking admin</a>
  <div style="font-size:12px;color:#8c857a;margin-top:14px;">Accept or decline there — the customer is emailed automatically when you accept.</div>
</td></tr></table></body></html>`;
  return deliver({
    to: NOTIFY_EMAIL,
    subject: `New booking request — ${v.date} at ${v.time} (${booking.reference})`,
    html, template: "notify", bookingId: booking.id,
  });
}

/** Render + deliver one of the booking lifecycle emails for a booking. */
export async function sendBookingEmail(key: EmailTemplateKey, booking: Booking): Promise<SendResult> {
  const cfg = await getConfig();
  const tpl = await getTemplate(key);
  const vars = buildVars(booking, cfg);
  return deliver({
    to: booking.email,
    subject: render(tpl.subject, vars),
    html: render(tpl.html, vars),
    template: key,
    bookingId: booking.id,
  });
}

export const emailProvider = (): Provider => (RESEND_KEY ? "resend" : SMTP_OK ? "smtp" : "outbox");
