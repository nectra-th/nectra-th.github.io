import { getBookings } from "@/lib/bookings";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "grech1978";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (key !== ADMIN_KEY) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink p-8 text-center">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-cream-light">Bookings Admin</h1>
          <p className="mt-3 text-cream-light/70">
            Access this page with your admin key:
            <br />
            <code className="mt-2 inline-block rounded bg-white/10 px-3 py-1 text-gold">
              /admin?key=YOUR_KEY
            </code>
          </p>
        </div>
      </main>
    );
  }

  const bookings = (await getBookings()).sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );

  return (
    <main className="min-h-screen bg-ink px-6 py-12 text-cream-light">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end justify-between">
          <h1 className="font-serif text-4xl font-semibold">Consultation Bookings</h1>
          <span className="rounded-full bg-gold/15 px-4 py-1.5 text-sm font-semibold text-gold">
            {bookings.length} total
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="mt-10 text-cream-light/60">No bookings yet.</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-cream-light/60">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 font-semibold">Booked</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3">
                      {new Date(b.date + "T00:00:00").toLocaleDateString("en-AU", {
                        weekday: "short", day: "numeric", month: "short",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gold">{b.time}</td>
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3 text-cream-light/70">{b.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-cream-light/70">{b.phone}</td>
                    <td className="max-w-[16rem] px-4 py-3 text-cream-light/60">{b.notes || "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-cream-light/40">
                      {new Date(b.createdAt).toLocaleString("en-AU", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
