import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

/* Branded 404 — same dark-ink editorial language as the site shell: logo,
   serif display heading, gold rule, and the standard primary CTA back to the
   homepage. Statically exported as 404.html for GitHub Pages, and used by
   Vercel for any unknown route. */
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <img src="/assets/logo-header.svg" alt="Grech Jewellers" width={249} height={68} className="h-auto w-[220px] md:w-[249px]" />
      <p className="fig-trim mt-14 font-serif text-[22px] font-semibold uppercase tracking-[0.12em] text-gold-dark">404</p>
      <h1 className="fig-trim mt-4 font-serif text-[40px] font-semibold leading-[1.1] text-cream-light md:text-[56px]">
        This Page Has<br />Slipped the Setting
      </h1>
      <span aria-hidden className="mx-auto mt-8 block h-0.5 w-[114px] bg-gold-dark" />
      <p className="mt-7 max-w-[34rem] font-sans text-[15px] font-medium leading-[25px] text-line md:text-[18px] md:font-normal md:leading-[27px]">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        Head back to the homepage to keep exploring.
      </p>
      <Link href="/" className="btn btn-primary mt-10">
        Back to Home
      </Link>
    </main>
  );
}
