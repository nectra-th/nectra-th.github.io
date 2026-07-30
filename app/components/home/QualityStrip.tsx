/* Recurring brand strip ("quality. integrity. craftsmanship. since 1978.")
   shown after the Four Pillars and the Process sections. Cormorant small-caps,
   tracked, above a hairline rule. */
export default function QualityStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`border-t border-line/70 pt-8 ${className}`}>
      <p className="text-center font-serif text-[17px] tracking-[0.1em] text-ink-3 [font-variant:small-caps] md:text-lg lg:text-[20px]">
        quality. integrity. craftsmanship. <span className="text-ink-2">since 1978.</span>
      </p>
    </div>
  );
}
