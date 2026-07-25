import { promises as fs } from "fs";
import path from "path";

export type Booking = {
  id: string;
  date: string; // ISO date, e.g. "2026-07-27"
  time: string; // e.g. "10:00AM"
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string; // ISO timestamp
};

export type NewBooking = Omit<Booking, "id" | "createdAt">;

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

export class SlotTakenError extends Error {
  constructor() {
    super("That appointment slot has just been booked. Please choose another.");
    this.name = "SlotTakenError";
  }
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Booking[]) : [];
  } catch {
    return [];
  }
}

/** Returns a map of date -> array of taken times, for disabling slots client-side. */
export async function getTakenSlots(): Promise<Record<string, string[]>> {
  const bookings = await getBookings();
  const map: Record<string, string[]> = {};
  for (const b of bookings) {
    (map[b.date] ??= []).push(b.time);
  }
  return map;
}

function makeId(): string {
  return "bk_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export async function addBooking(input: NewBooking): Promise<Booking> {
  await ensureFile();
  const bookings = await getBookings();

  const clash = bookings.some(
    (b) => b.date === input.date && b.time === input.time
  );
  if (clash) throw new SlotTakenError();

  const booking: Booking = {
    id: makeId(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
  return booking;
}
