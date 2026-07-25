"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui";
import { Check } from "../../components/icons";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { AuthField } from "../../components/auth/AuthField";
import { SocialAuth } from "../../components/auth/SocialAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Form = { email: string; password: string };
type FieldKey = keyof Form;

export default function LoginPage() {
  const [form, setForm] = useState<Form>({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: FieldKey) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k: FieldKey) => () => setTouched((t) => ({ ...t, [k]: true }));

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (form.password.length < 1) e.password = "Please enter your password.";
    return e;
  }, [form]);

  const show = (k: FieldKey) => (touched[k] ? errors[k] : undefined);
  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  async function fakeAuth(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    // UI-ONLY STUB — no backend. Simulate a request, then show success.
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 animate-pop-in items-center justify-center rounded-full bg-gold/15">
          <Check className="h-9 w-9 text-gold" />
        </div>
        <h1 className="mt-6 font-serif text-[2.1rem] font-semibold leading-[1.1] text-ink-text">
          Welcome back
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-body">
          You’re signed in as{" "}
          <span className="font-semibold text-ink-text">{form.email.trim()}</span>.
        </p>
        <div className="mt-8">
          <Button href="/" variant="gold" className="w-full">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <span className="eyebrow">Grech Members</span>
      <h1 className="rule-gold mt-3 font-serif text-[2.4rem] font-semibold leading-[1.08] text-ink-text">
        Welcome back
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-body">
        Sign in to pick up where you left off.
      </p>

      <AuthTabs />

      <form className="mt-8 space-y-5" onSubmit={fakeAuth} noValidate>
        <AuthField
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={set("email")}
          onBlur={blur("email")}
          placeholder="jane@example.com"
          autoComplete="email"
          error={show("email")}
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={set("password")}
          onBlur={blur("password")}
          placeholder="••••••••"
          autoComplete="current-password"
          error={show("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[13px] text-body">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Keep me signed in
          </label>
          <a
            href="#"
            className="text-[13px] font-medium text-gold transition-colors hover:text-gold-dark"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="gold"
          className={`w-full ${!canSubmit ? "opacity-50" : ""}`}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[12px] uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-line" />
        or continue with
        <span className="h-px flex-1 bg-line" />
      </div>

      <SocialAuth verb="Sign in" />

      <p className="mt-8 text-center text-[14px] text-body">
        New to Grech?{" "}
        <Link href="/signup" className="font-semibold text-gold transition-colors hover:text-gold-dark">
          Create an account
        </Link>
      </p>
    </>
  );
}
