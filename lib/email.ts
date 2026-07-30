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
  to: string; subject: string; html: string; template: EmailTemplateKey | "test"; bookingId?: string;
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
