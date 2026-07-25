"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "../../components/ui";
import { Check } from "../../components/icons";
import { AuthTabs } from "../../components/auth/AuthTabs";
import { AuthField } from "../../components/auth/AuthField";
import { PasswordMeter, scorePassword } from "../../components/auth/PasswordMeter";
import { SocialAuth } from "../../components/auth/SocialAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Form = { fullName: string; email: string; password: string; confirm: string };
type FieldKey = keyof Form;

export default function SignUpPage() {
  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [news, setNews] = useState(true);
  const [touched, setTouched] = useState<Record<FieldKey | "agree", boolean>>({
    fullName: false,
    email: false,
    password: false,
    confirm: false,
    agree: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: FieldKey) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const blur = (k: FieldKey | "agree") => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey | "agree", string>> = {};
    if (form.fullName.trim().length < 2) e.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address.";
    if (form.password.length < 8) e.password = "Use at least 8 characters.";
    if (form.confirm !== form.password || !form.confirm)
      e.confirm = "Passwords don’t match.";
    if (!agree) e.agree = "Please accept the Terms to continue.";
    return e;
  }, [form, agree]);

  const show = (k: FieldKey | "agree") =>
    touched[k] ? errors[k] : undefined;
  const valid = (k: FieldKey) => touched[k] && !errors[k] && form[k].length > 0;

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  async function fakeAuth(e: React.FormEvent) {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirm: true,
      agree: true,
    });
    if (Object.keys(errors).length) return;
    setSubmitting(true);
    // UI-ONLY STUB — no backend. Simulate a request, then show success.
    await new Promise((r) => setTimeout(r, 900));
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
          Welcome, {form.fullName.trim().split(" ")[0]}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-body">
          Your Grech Jewellers account is ready. We’ve sent a confirmation to{" "}
          <span className="font-semibold text-ink-text">{form.email.trim()}</span>.
        </p>
        <div className="mt-8">
          <Button href="/" variant="gold" className="w-full">
            Continue
          </Button>
        </div>
        <p className="mt-5 text-[14px] text-body">
          Not you?{" "}
          <Link href="/login" className="font-semibold text-gold transition-colors hover:text-gold-dark">
            Sign in instead
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <span className="eyebrow">Grech Members</span>
      <h1 className="rule-gold mt-3 font-serif text-[2.4rem] font-semibold leading-[1.08] text-ink-text">
        Create your account
      </h1>
      <p className="mt-5 text-[15px] leading-relaxed text-body">
        Save the pieces you love and keep every sketch, quote and design in one place.
      </p>

      <AuthTabs />

      <form className="mt-8 space-y-5" onSubmit={fakeAuth} noValidate>
        <AuthField
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={set("fullName")}
          onBlur={blur("fullName")}
          placeholder="Jane Smith"
          autoComplete="name"
          error={show("fullName")}
          valid={valid("fullName")}
        />
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
          valid={valid("email")}
        />
        <div>
          <AuthField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={set("password")}
            onBlur={blur("password")}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={show("password")}
          />
          <PasswordMeter value={form.password} />
        </div>
        <AuthField
          label="Confirm password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={set("confirm")}
          onBlur={blur("confirm")}
          placeholder="Re-enter password"
          autoComplete="new-password"
          error={show("confirm")}
          valid={valid("confirm") && scorePassword(form.password) > 0}
        />

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={news}
            onChange={(e) => setNews(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-gold"
          />
          <span className="text-[13px] leading-snug text-body">
            Send me occasional news on new collections and events.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              setTouched((t) => ({ ...t, agree: true }));
            }}
            className="mt-0.5 h-4 w-4 accent-gold"
          />
          <span className="text-[13px] leading-snug text-body">
            I agree to the{" "}
            <a className="text-gold underline-offset-2 hover:underline" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="text-gold underline-offset-2 hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        {show("agree") && (
          <p className="-mt-2 text-[13px] text-red-600">{errors.agree}</p>
        )}

        <Button
          type="submit"
          variant="gold"
          className={`w-full ${!canSubmit ? "opacity-50" : ""}`}
        >
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[12px] uppercase tracking-[0.14em] text-muted">
        <span className="h-px flex-1 bg-line" />
        or continue with
        <span className="h-px flex-1 bg-line" />
      </div>

      <SocialAuth verb="Sign up" />

      <p className="mt-8 text-center text-[14px] text-body">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gold transition-colors hover:text-gold-dark">
          Sign in
        </Link>
      </p>
    </>
  );
}
