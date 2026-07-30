// Shared types for the booking backend.

export type BookingStatus = "pending" | "confirmed" | "declined";

export type Booking = {
  id: string;
  reference: string; // customer-facing, e.g. "GJ-240714-1842"
  status: BookingStatus;
  date: string; // ISO date "2026-10-14"
  time: string; // slot label "10:30 AM"
  name: string;
  email: string;
  phone: string;
  project?: string; // e.g. "Engagement Ring"
  notes?: string;
  createdAt: string; // ISO timestamp
  decidedAt?: string; // when approved/declined
};

export type NewBooking = Pick<Booking, "date" | "time" | "name" | "email" | "phone"> &
  Partial<Pick<Booking, "project" | "notes">>;

// Availability configuration — what the public calendar offers.
export type AvailabilityConfig = {
  timeSlots: string[]; // ["9:00 AM", ...]
  openWeekdays: number[]; // 0=Sun … 6=Sat
  slotDurationMin: number; // appointment length shown in the confirmed email
  leadDays: number; // earliest bookable day = today + leadDays
  maxAdvanceDays: number; // furthest bookable day
  blackoutDates: string[]; // ISO dates that are fully closed
  timezone: string;
  location: string; // shown in emails
  directionsUrl: string; // "Open Directions" link
};

export type EmailTemplateKey = "received" | "confirmed";

export type EmailTemplate = {
  subject: string;
  html: string;
  updatedAt: string;
};

export type TemplateVersion = EmailTemplate & {
  id: string;
  savedAt: string;
  note?: string;
};

export type Templates = Record<EmailTemplateKey, EmailTemplate>;
export type TemplateVersions = Record<EmailTemplateKey, TemplateVersion[]>;

export type OutboxEntry = {
  id: string;
  to: string;
  subject: string;
  html: string;
  template: EmailTemplateKey | "test";
  bookingId?: string;
  provider: "resend" | "smtp" | "outbox"; // "outbox" = queued (no email transport configured)
  status: "sent" | "queued" | "error";
  error?: string;
  createdAt: string;
};

// The variables available to templates ({{name}}, {{date}}, …).
export type TemplateVars = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  project: string;
  reference: string;
  duration: string;
  location: string;
  directionsUrl: string;
};
