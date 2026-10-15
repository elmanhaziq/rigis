"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { Field } from "./field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { contactSchema, enquiryTypes } from "@/lib/validation/contact";
import { submitContact } from "@/lib/contact";

type Errors = Partial<Record<string, string>>;
type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "failed"; message: string };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Time of first interaction, used as a simple bot heuristic.
  const startedAt = useRef(0);
  const typeRef = useRef<HTMLSelectElement>(null);

  // Pre-select the enquiry type when arriving from a "Work with us" pathway (?type=).
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type && typeRef.current && enquiryTypes.some((t) => t.value === type)) typeRef.current.value = type;
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: fd.get("name"),
      email: fd.get("email"),
      organisation: fd.get("organisation"),
      enquiryType: fd.get("enquiryType"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
    };
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus({ kind: "idle" });
      const first = Object.keys(next)[0];
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    // Bots usually submit instantly; silently ignore anything under 3 seconds.
    if (!startedAt.current || Date.now() - startedAt.current < 3000 || parsed.data.website) {
      setStatus({ kind: "sent" });
      return;
    }
    setStatus({ kind: "sending" });
    const result = await submitContact(parsed.data);
    if (result.ok) {
      setStatus({ kind: "sent" });
      formRef.current?.reset();
    } else {
      setStatus({ kind: "failed", message: result.message });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-success/30 bg-success-bg p-8">
        <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
        <h3 className="mt-4 font-heading text-xl font-semibold">Thank you — your message has been sent</h3>
        <p className="mt-2 text-muted-foreground">A member of the group will reply to the email address you provided.</p>
        <Button variant="outline" className="mt-6" onClick={() => { startedAt.current = 0; setStatus({ kind: "idle" }); }}>
          Send another message
        </Button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }} className="grid gap-6 sm:grid-cols-2" aria-describedby="contact-required-note">
      <p id="contact-required-note" className="text-sm text-muted-foreground sm:col-span-2">
        Fields marked <span className="text-destructive">*</span> are required.
      </p>

      <Field id="contact-name" label="Full name" required error={errors.name}>
        {(p) => <Input {...p} name="name" autoComplete="name" maxLength={120} />}
      </Field>
      <Field id="contact-email" label="Email address" required error={errors.email}>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" inputMode="email" maxLength={254} />}
      </Field>
      <Field id="contact-org" label="Organisation" error={errors.organisation}>
        {(p) => <Input {...p} name="organisation" autoComplete="organization" maxLength={160} />}
      </Field>
      <Field id="contact-type" label="Enquiry type" required error={errors.enquiryType}>
        {(p) => (
          <div className="relative">
          <select
            {...p}
            ref={typeRef}
            name="enquiryType"
            defaultValue=""
            className="h-10 w-full appearance-none rounded-md border border-input bg-card pr-9 pl-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-invalid:border-destructive"
          >
            <option value="" disabled>
              Choose one…
            </option>
            {enquiryTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </Field>
      <Field id="contact-subject" label="Subject" required error={errors.subject} className="sm:col-span-2">
        {(p) => <Input {...p} name="subject" maxLength={160} />}
      </Field>
      <Field id="contact-message" label="Message" required error={errors.message} hint="Please avoid sharing confidential or sensitive information." className="sm:col-span-2">
        {(p) => <Textarea {...p} name="message" rows={7} maxLength={4000} className="min-h-40" />}
      </Field>

      {/* Honeypot — hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[0.9375rem]">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "contact-consent-error" : undefined}
            className="mt-1 size-4 shrink-0 accent-purple-700"
          />
          <span>I agree that RIGIS may store my details to respond to this enquiry.</span>
        </label>
        {errors.consent && (
          <p id="contact-consent-error" className="mt-2 text-[0.8125rem] font-medium text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      {status.kind === "failed" && (
        <div role="alert" className="flex gap-3 border border-warning/40 bg-warning-bg p-4 text-[0.9375rem] sm:col-span-2">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
          <p>{status.message}</p>
        </div>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto">
          {sending ? (
            <Loader2 data-icon="inline-start" className="animate-spin" aria-hidden="true" />
          ) : (
            <Send data-icon="inline-start" aria-hidden="true" />
          )}
          {sending ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
