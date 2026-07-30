import type { AvailabilityConfig, Templates } from "./booking-types";

export const DEFAULT_CONFIG: AvailabilityConfig = {
  timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"],
  openWeekdays: [1, 2, 3, 4, 5, 6], // Mon–Sat
  slotDurationMin: 45,
  leadDays: 1,
  maxAdvanceDays: 90,
  blackoutDates: [],
  timezone: "Australia/Adelaide",
  location: "Grech Jewellers, West Lakes Shopping Centre",
  directionsUrl:
    "https://www.google.com/maps/search/?api=1&query=Grech+Jewellers+457+Tapleys+Hill+Road+Fulham+Gardens+SA+5024",
};

// ---- Email templates (email-client-safe HTML: tables + inline styles) -------
// Variables: {{name}} {{email}} {{phone}} {{date}} {{time}} {{project}}
// {{reference}} {{duration}} {{location}} {{directionsUrl}}
// Icons are hosted PNGs (render in every client, incl. Gmail which strips SVG).

const A = (process.env.EMAIL_ASSET_BASE || "https://grech-jewellers.vercel.app") + "/assets/email";
const ic = (name: string, size = 18) => `<img src="${A}/${name}.png" width="${size}" height="${size}" alt="" style="display:block;border:0;">`;

const shell = (inner: string) => `<!doctype html><html><body style="margin:0;padding:0;background:#0f0e0d;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e0d;padding:32px 0;font-family:Georgia,'Times New Roman',serif;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92%;background:#161412;border:1px solid #2a2622;border-radius:14px;overflow:hidden;">
<tr><td style="padding:42px 44px 10px;text-align:center;">
  <div style="width:66px;height:66px;margin:0 auto 16px;border:1.5px solid #b88c46;border-radius:50%;line-height:64px;color:#c69a52;font-size:25px;letter-spacing:1px;">GJ</div>
  <div style="color:#f1ece2;font-size:25px;letter-spacing:6px;">GRECH JEWELLERS</div>
  <div style="color:#b88c46;font-size:11px;letter-spacing:3px;margin-top:7px;">ESTABLISHED 1978</div>
  <table role="presentation" width="100%" style="margin-top:22px;"><tr>
    <td style="height:1px;background:linear-gradient(90deg,transparent,#8a6a34);"></td>
    <td width="10" style="text-align:center;"><span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:#b88c46;"></span></td>
    <td style="height:1px;background:linear-gradient(90deg,#8a6a34,transparent);"></td>
  </tr></table>
</td></tr>
${inner}
<tr><td style="padding:22px 44px 38px;border-top:1px solid #2a2622;font-family:Arial,sans-serif;">
  <table role="presentation"><tr>
    <td width="26" style="vertical-align:middle;padding:3px 0;">${ic("pin-f", 15)}</td>
    <td style="color:#c9a86a;font-size:13px;padding:3px 0;">Grech Jewellers · West Lakes Shopping Centre</td></tr>
  <tr>
    <td style="vertical-align:middle;padding:3px 0;">${ic("phone-f", 14)}</td>
    <td style="color:#8c857a;font-size:12px;padding:3px 0;">(08) 8347 7177</td></tr>
  <tr>
    <td style="vertical-align:middle;padding:3px 0;">${ic("mail-f", 14)}</td>
    <td style="color:#8c857a;font-size:12px;padding:3px 0;">hello@grech.com.au</td></tr>
  <tr>
    <td style="vertical-align:middle;padding:3px 0;">${ic("globe-f", 14)}</td>
    <td style="color:#8c857a;font-size:12px;padding:3px 0;">www.grech.com.au</td></tr>
  </table>
</td></tr>
</table></td></tr></table></body></html>`;

const iconRow = (icon: string, label: string, value: string) => `<tr>
  <td width="32" style="padding:10px 0;vertical-align:middle;">${ic(icon + "-m", 18)}</td>
  <td style="padding:10px 0;color:#6f675c;font-size:13px;font-family:Arial,sans-serif;width:128px;vertical-align:middle;">${label}</td>
  <td style="padding:10px 0;color:#2e2926;font-size:14px;font-family:Arial,sans-serif;vertical-align:middle;">${value}</td>
</tr>`;

const step = (n: string, text: string) => `<td width="25%" style="text-align:center;vertical-align:top;padding:0 5px;">
  <div style="width:32px;height:32px;line-height:32px;border-radius:50%;background:#211f1c;color:#c9a86a;margin:0 auto 9px;font-family:Georgia,serif;font-size:14px;">${n}</div>
  <div style="color:#575048;font-size:12px;font-family:Arial,sans-serif;line-height:17px;">${text}</div></td>`;

// centre the visit icon inside an align="center" wrapper cell
const visitFixed = (icon: string, title: string, text: string) => `<td width="33%" style="text-align:center;vertical-align:top;padding:0 8px;">
  <table role="presentation" align="center"><tr><td>${ic(icon + "-g", 28)}</td></tr></table>
  <div style="color:#2e2926;font-size:14px;margin-top:9px;">${title}</div>
  <div style="color:#575048;font-size:12px;font-family:Arial,sans-serif;line-height:16px;margin-top:5px;">${text}</div></td>`;

const RECEIVED = shell(`
<tr><td style="padding:16px 44px 0;text-align:center;">
  <h1 style="color:#f4efe6;font-size:29px;font-weight:normal;margin:12px 0 10px;">Thank you for your enquiry.</h1>
  <p style="color:#cfc6b8;font-size:15px;line-height:24px;font-family:Arial,sans-serif;margin:8px 0;">We have received your consultation request and one of our jewellers will personally review it shortly.</p>
  <p style="color:#9f968a;font-size:13px;line-height:22px;font-family:Arial,sans-serif;margin:8px 0 4px;">Unlike automated booking systems, every consultation is individually reviewed to ensure we can dedicate the appropriate time to your project.</p>
</td></tr>
<tr><td style="padding:22px 44px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;border-radius:12px;">
  <tr><td style="padding:26px 30px 10px;text-align:center;"><div style="color:#2e2926;font-size:19px;">Consultation Request</div></td></tr>
  <tr><td style="padding:4px 30px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${iconRow("user", "Name", "{{name}}")}
      ${iconRow("mail", "Email", "{{email}}")}
      ${iconRow("phone", "Phone", "{{phone}}")}
      ${iconRow("calendar", "Preferred Date", "{{date}}")}
      ${iconRow("clock", "Preferred Time", "{{time}}")}
      ${iconRow("diamond", "Project", "{{project}}")}
    </table>
    <div style="border-top:1px solid #ded4c2;margin:14px 0;"></div>
    <div style="color:#6f675c;font-size:13px;font-family:Arial,sans-serif;">Reference Number
      <span style="color:#9c7430;font-weight:bold;">&nbsp;{{reference}}</span></div>
  </td></tr>
  <tr><td style="padding:10px 30px 28px;text-align:center;">
    <div style="color:#9c7430;font-size:15px;margin-bottom:16px;">What Happens Next</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      ${step("1", "Our jeweller reviews your request.")}
      ${step("2", "We'll confirm availability.")}
      ${step("3", "You'll receive an approval email.")}
      ${step("4", "See you in store.")}
    </tr></table>
    <div style="border-top:1px solid #ded4c2;margin:22px 0 12px;"></div>
    <div style="color:#8a8073;font-size:12px;font-family:Arial,sans-serif;line-height:18px;">If we need to suggest an alternative time,<br>we'll contact you before confirming your appointment.</div>
  </td></tr>
  </table>
</td></tr>`);

const CONFIRMED = shell(`
<tr><td style="padding:16px 44px 0;text-align:center;">
  <h1 style="color:#f4efe6;font-size:29px;font-weight:normal;margin:12px 0 8px;">Your consultation has been confirmed.</h1>
  <p style="color:#cfc6b8;font-size:15px;font-family:Arial,sans-serif;margin:4px 0;">We're looking forward to meeting you.</p>
</td></tr>
<tr><td style="padding:22px 44px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;border-radius:12px;">
  <tr><td style="padding:26px 30px 8px;">
    <table role="presentation" width="100%"><tr>
      <td style="color:#2e2926;font-size:19px;">Appointment Details</td>
      <td align="right"><span style="background:#9c7430;color:#fff;font-family:Arial,sans-serif;font-size:12px;padding:7px 15px;border-radius:20px;white-space:nowrap;">&#10003;&nbsp; CONFIRMED</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:4px 30px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${iconRow("calendar", "Date", "{{date}}")}
      ${iconRow("clock", "Time", "{{time}}")}
      ${iconRow("hourglass", "Duration", "{{duration}}")}
      ${iconRow("pin", "Location", "{{location}}")}
    </table>
    <div style="border-top:1px solid #ded4c2;margin:12px 0;"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${iconRow("bookmark", "Reference", '<span style="color:#9c7430;font-weight:bold;">{{reference}}</span>')}</table>
  </td></tr>
  <tr><td style="padding:8px 30px 12px;text-align:center;">
    <div style="color:#9c7430;font-size:15px;margin-bottom:16px;">Before Your Visit</div>
    <table role="presentation" width="100%"><tr>
      ${visitFixed("ring", "Existing jewellery", "Bring any jewellery you'd like us to redesign.")}
      ${visitFixed("camera", "Inspiration", "Photos or screenshots are welcome.")}
      ${visitFixed("diamond", "Stones", "If you already have gemstones, bring them along.")}
    </tr></table>
    <a href="{{directionsUrl}}" style="display:inline-block;margin:24px 0 6px;background:#161412;color:#f4efe6;font-family:Arial,sans-serif;font-size:13px;letter-spacing:1px;text-decoration:none;padding:14px 30px;border-radius:30px;">&#9673;&nbsp; OPEN DIRECTIONS</a>
    <div style="border-top:1px solid #ded4c2;margin:20px 0 12px;"></div>
    <div style="color:#8a8073;font-size:12px;font-family:Arial,sans-serif;line-height:18px;">Need to change your appointment?<br>Simply reply to this email or call us on (08) 8347 7177.</div>
  </td></tr>
  </table>
</td></tr>`);

export const DEFAULT_TEMPLATES: Templates = {
  received: {
    subject: "We've received your consultation request — {{reference}}",
    html: RECEIVED,
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
  confirmed: {
    subject: "Your consultation is confirmed — {{date}} at {{time}}",
    html: CONFIRMED,
    updatedAt: "1970-01-01T00:00:00.000Z",
  },
};
