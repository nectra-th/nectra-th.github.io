"use client";

import { useId, useState } from "react";
import type { HTMLInputTypeAttribute } from "react";
import { Check } from "../icons";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  valid?: boolean;
};

export function AuthField({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  autoComplete,
  error,
  valid = false,
}: Props) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (reveal ? "text" : "password") : type;

  const border = error
    ? "border-red-400 focus:border-red-400 focus:ring-red-300/30"
    : "border-line focus:border-gold focus:ring-gold/30";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.12em] text-body">
        {label}
      </span>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full rounded-md border bg-white px-4 py-3 text-[15px] text-ink-text outline-none transition placeholder:text-muted focus:ring-1 ${border} ${
            isPassword ? "pr-16" : valid ? "pr-11" : ""
          }`}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 flex items-center text-[12px] font-semibold uppercase tracking-[0.08em] text-gold transition-colors hover:text-gold-dark focus-visible:outline-none focus-visible:text-gold-dark"
          >
            {reveal ? "Hide" : "Show"}
          </button>
        ) : valid ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Check className="h-5 w-5 text-gold" />
          </span>
        ) : null}
      </div>

      {error ? (
        <span id={`${id}-err`} className="mt-1.5 block text-[13px] text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}
