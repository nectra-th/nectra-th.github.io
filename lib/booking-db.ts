import { readJson, writeJson } from "./store";
import { DEFAULT_CONFIG, DEFAULT_TEMPLATES } from "./defaults";
import type {
  AvailabilityConfig, Booking, BookingStatus, EmailTemplate, EmailTemplateKey,
  NewBooking, OutboxEntry, TemplateVersion, Templates, TemplateVersions,
} from "./booking-types";

const F = {
  bookings: "bookings.json",
  config: "config.json",
  templates: "templates.json",
  versions: "template-versions.json",
  outbox: "outbox.json",
};

const rid = (n = 8) => Math.random().toString(36).slice(2, 2 + n);
const nowIso = () => new Date().toISOString();

// ---- config -----------------------------------------------------------------
export async function getConfig(): Promise<AvailabilityConfig> {
  const saved = await readJson<Partial<AvailabilityConfig>>(F.config, {});
  return { ...DEFAULT_CONFIG, ...saved };
}
export async function setConfig(patch: Partial<AvailabilityConfig>): Promise<AvailabilityConfig> {
  const next = { ...(await getConfig()), ...patch };
  await writeJson(F.config, next);
  return next;
}

// ---- bookings ---------------------------------------------------------------
export async function getBookings(): Promise<Booking[]> {
  return readJson<Booking[]>(F.bookings, []);
}

export async function getTakenSlots(): Promise<Record<string, string[]>> {
  const map: Record<string, string[]> = {};
  for (const b of await getBookings()) {
    if (b.status === "declined") continue; // declined slots free up again
    (map[b.date] ??= []).push(b.time);
  }
  return map;
}

/** Derived availability for the public calendar. */
export async function getAvailability() {
  const cfg = await getConfig();
  const taken = await getTakenSlots();
  return {
    timeSlots: cfg.timeSlots,
    openWeekdays: cfg.openWeekdays,
    leadDays: cfg.leadDays,
    maxAdvanceDays: cfg.maxAdvanceDays,
    blackoutDates: cfg.blackoutDates,
    slotDurationMin: cfg.slotDurationMin,
    taken,
  };
}

function makeReference(date: string): string {
  const compact = date.replace(/-/g, "").slice(2); // YYMMDD
  return `GJ-${compact}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export class SlotTakenError extends Error {
  constructor() { super("That appointment slot has just been booked. Please choose another."); this.name = "SlotTakenError"; }
}

export async function createBooking(input: NewBooking): Promise<Booking> {
  const bookings = await getBookings();
  const clash = bookings.some((b) => b.status !== "declined" && b.date === input.date && b.time === input.time);
  if (clash) throw new SlotTakenError();
  const booking: Booking = {
    id: "bk_" + rid() + Date.now().toString(36),
    reference: makeReference(input.date),
    status: "pending",
    date: input.date, time: input.time, name: input.name, email: input.email, phone: input.phone,
    project: input.project || "", notes: input.notes || "",
    createdAt: nowIso(),
  };
  bookings.push(booking);
  await writeJson(F.bookings, bookings);
  return booking;
}

/** Admin-created booking (walk-in / phone). Email is optional; status is chosen
 *  by the admin (defaults to confirmed). Clashes with an ACTIVE booking are
 *  rejected unless `force` is set. */
export async function adminCreateBooking(
  input: NewBooking & { status?: BookingStatus }, force = false,
): Promise<Booking> {
  const bookings = await getBookings();
  const clash = bookings.some((b) => b.status !== "declined" && b.date === input.date && b.time === input.time);
  if (clash && !force) throw new SlotTakenError();
  const status = input.status ?? "confirmed";
  const booking: Booking = {
    id: "bk_" + rid() + Date.now().toString(36),
    reference: makeReference(input.date),
    status,
    date: input.date, time: input.time, name: input.name, email: input.email, phone: input.phone,
    project: input.project || "", notes: input.notes || "",
    createdAt: nowIso(), decidedAt: status !== "pending" ? nowIso() : undefined,
  };
  bookings.push(booking);
  await writeJson(F.bookings, bookings);
  return booking;
}

export async function decideBooking(id: string, status: Exclude<BookingStatus, "pending">): Promise<Booking | null> {
  const bookings = await getBookings();
  const b = bookings.find((x) => x.id === id);
  if (!b) return null;
  b.status = status;
  b.decidedAt = nowIso();
  await writeJson(F.bookings, bookings);
  return b;
}

// ---- email templates + versioning ------------------------------------------
export async function getTemplates(): Promise<Templates> {
  const saved = await readJson<Partial<Templates>>(F.templates, {});
  return { received: saved.received ?? DEFAULT_TEMPLATES.received, confirmed: saved.confirmed ?? DEFAULT_TEMPLATES.confirmed };
}
export async function getTemplate(key: EmailTemplateKey): Promise<EmailTemplate> {
  return (await getTemplates())[key];
}
export async function getAllVersions(): Promise<TemplateVersions> {
  const v = await readJson<Partial<TemplateVersions>>(F.versions, {});
  return { received: v.received ?? [], confirmed: v.confirmed ?? [] };
}
export async function getVersions(key: EmailTemplateKey): Promise<TemplateVersion[]> {
  return (await getAllVersions())[key];
}

/** Save a template. Snapshots the PREVIOUS version first so edits are revertible. */
export async function saveTemplate(key: EmailTemplateKey, subject: string, html: string, note?: string): Promise<EmailTemplate> {
  const templates = await getTemplates();
  const versions = await getAllVersions();
  const prev = templates[key];
  // snapshot the outgoing template (skip the very first placeholder)
  if (prev && prev.updatedAt !== "1970-01-01T00:00:00.000Z") {
    versions[key] = [
      { ...prev, id: "v_" + rid(), savedAt: nowIso(), note: "auto-snapshot before edit" },
      ...versions[key],
    ].slice(0, 50);
  } else if ((versions[key]?.length ?? 0) === 0) {
    // keep the shipped default as the earliest revertible baseline
    versions[key] = [{ ...prev, id: "v_default", savedAt: nowIso(), note: "shipped default" }];
  }
  const next: EmailTemplate = { subject, html, updatedAt: nowIso() };
  templates[key] = next;
  await writeJson(F.versions, versions);
  await writeJson(F.templates, templates);
  return next;
}

export async function revertTemplate(key: EmailTemplateKey, versionId: string): Promise<EmailTemplate | null> {
  const versions = await getVersions(key);
  const v = versions.find((x) => x.id === versionId);
  if (!v) return null;
  return saveTemplate(key, v.subject, v.html, `reverted to ${versionId}`);
}

// ---- outbox (email audit / queue) ------------------------------------------
export async function getOutbox(): Promise<OutboxEntry[]> {
  return readJson<OutboxEntry[]>(F.outbox, []);
}
export async function addOutbox(entry: Omit<OutboxEntry, "id" | "createdAt">): Promise<OutboxEntry> {
  const list = await getOutbox();
  const full: OutboxEntry = { ...entry, id: "ob_" + rid(), createdAt: nowIso() };
  await writeJson(F.outbox, [full, ...list].slice(0, 200));
  return full;
}
