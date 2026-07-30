/* Recurring brand strip ("quality. integrity. craftsmanship. since 1978.")
   shown after the Four Pillars and the Process sections. Figma's "Line 1" is
   a full-width divider (not a faint border) — solid #D8CBB7, 1px, with a
   17px gap (itemSpacing) to the text below, not a generic border+padding
   guess. Cormorant small-caps, 0.1em tracking, 115% line-height, cap-height
   trimmed. */
export default function QualityStrip({ className = "" }: { className?: string }) {
  return (
    <div className={`border-t border-divider pt-[17px] ${className}`}>
      <p className="fig-trim text-center font-serif text-[17px] leading-[115%] tracking-[0.1em] text-body-2 [font-variant:small-caps] md:text-lg lg:text-[20px]">
        quality. integrity. craftsmanship. <span className="text-gold-dark">since 1978.</span>
      </p>
    </div>
  );
}
