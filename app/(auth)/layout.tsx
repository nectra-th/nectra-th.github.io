import Image from "next/image";
import Link from "next/link";
import { Check } from "../components/icons";

const BENEFITS = [
  "Save the designs and pieces you love",
  "Track your consultations, quotes and repairs",
  "Pick up every conversation where you left off",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen bg-cream-light lg:grid-cols-2">
      {/* LEFT — jewellery hero, lg+ only */}
      <aside className="relative hidden lg:block">
        <Image
          src="/assets/footer-ring.jpg"
          alt="A Grech Jewellers piece"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/40 to-ink/75" />

        {/* Seal + return-home link, top-left */}
        <Link
          href="/"
          aria-label="Grech Jewellers home"
          className="absolute left-10 top-10 flex items-center gap-3"
        >
          <Image
            src="/assets/gj-seal.png"
            alt="Grech Jewellers"
            width={56}
            height={56}
            className="h-14 w-14 opacity-95"
          />
        </Link>

        {/* Brand line + member benefits, bottom-left */}
        <div className="absolute inset-x-10 bottom-14">
          <span className="eyebrow text-gold">Since 1978</span>
          <p className="mt-3 max-w-[22rem] font-serif text-[2.35rem] font-medium leading-[1.1] text-cream-light">
            A relationship,
            <br />
            not just a transaction.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <Check className="h-[18px] w-[18px] shrink-0 text-gold" />
                <span className="text-[14px] text-cream-light/85">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* RIGHT — form slot */}
      <section className="flex flex-col items-center justify-center px-6 py-14 sm:px-10">
        {/* Compact brand presence on small screens (no left panel there) */}
        <Link
          href="/"
          aria-label="Grech Jewellers home"
          className="mb-8 flex items-center gap-3 lg:hidden"
        >
          <Image
            src="/assets/gj-seal.png"
            alt="Grech Jewellers"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="eyebrow">Grech Jewellers</span>
        </Link>

        <div className="w-full max-w-[440px]">{children}</div>
      </section>
    </main>
  );
}
