"use client";

export function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0–4
}

const LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const BAR = ["bg-line", "bg-red-400", "bg-gold-light", "bg-gold", "bg-gold-dark"];

export function PasswordMeter({ value }: { value: string }) {
  const score = scorePassword(value);
  if (!value) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= score ? BAR[score] : "bg-line"
            }`}
          />
        ))}
      </div>
      <span className="mt-1.5 block text-[12px] tracking-wide text-body">
        {LABELS[score]}
      </span>
    </div>
  );
}
