"use client";

import { addTransitionType, startTransition, useEffect, useId, useRef, useState, ViewTransition } from "react";
import { site } from "@/content/site";

type Brief = {
  kind: string;
  description: string;
  mcu: string;
  links: string[];
  power: string;
  quantity: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string; // honeypot
};

const EMPTY: Brief = {
  kind: "",
  description: "",
  mcu: "",
  links: [],
  power: "",
  quantity: "",
  timeline: "",
  budget: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
};

const STEPS = ["The project", "The hardware", "Scale and timing", "About you"] as const;

const KINDS = [
  { value: "New device", hint: "Something that doesn't exist yet" },
  { value: "Fix or improve a device", hint: "Battery, crashes, data loss" },
  { value: "Review", hint: "A measured second opinion" },
  { value: "Research prototype", hint: "For a lab or research group" },
];

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

function briefText(b: Brief): string {
  const line = (k: string, v: string) => (v ? `${k}: ${v}` : null);
  return [
    line("Project", b.kind),
    "",
    b.description,
    "",
    line("Microcontroller", b.mcu),
    line("Connectivity", b.links.join(", ")),
    line("Power", b.power),
    line("Quantity", b.quantity),
    line("Timeline", b.timeline),
    line("Budget", b.budget),
    "",
    line("Name", b.name),
    line("Email", b.email),
    line("Company", b.company),
    line("Phone or WhatsApp", b.phone),
  ]
    .filter((x) => x !== null)
    .join("\n");
}

export function IntakeForm() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"editing" | "sending" | "sent-mail" | "sent-api" | "failed">("editing");
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const firstRender = useRef(true);

  // Move focus to the new step's heading after each step change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const title = formRef.current?.querySelector<HTMLElement>("[data-step-title]");
    title?.focus({ preventScroll: true });
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step]);

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => {
    setBrief((b) => ({ ...b, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!brief.kind) e.kind = "Choose the kind of project.";
      if (brief.description.trim().length < 20)
        e.description = "Describe the device and the problem in a sentence or two (at least 20 characters).";
    }
    if (s === 3) {
      if (!brief.name.trim()) e.name = "Add your name so we know who to reply to.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) e.email = "Add an email address we can reply to.";
    }
    return e;
  };

  const go = (next: number) => {
    if (next > step) {
      const e = validate(step);
      if (Object.keys(e).length) {
        setErrors(e);
        focusFirstError(e);
        return;
      }
    }
    startTransition(() => {
      addTransitionType(next > step ? "form-next" : "form-prev");
      setStep(next);
    });
  };

  const focusFirstError = (e: Record<string, string>) => {
    const first = Object.keys(e)[0];
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < STEPS.length - 1) {
      go(step + 1);
      return;
    }
    const e = validate(3);
    if (Object.keys(e).length) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    if (brief.website) return; // a bot filled the hidden field
    const subject = `Project brief: ${brief.kind}, ${brief.name}`;
    if (ENDPOINT) {
      setStatus("sending");
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...brief, links: brief.links.join(", "), _subject: subject, message: briefText(brief) }),
        });
        if (!res.ok) throw new Error(String(res.status));
        startTransition(() => {
          addTransitionType("form-next");
          setStatus("sent-api");
        });
      } catch {
        setStatus("failed");
      }
      return;
    }
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText(brief))}`;
    startTransition(() => {
      addTransitionType("form-next");
      setStatus("sent-mail");
    });
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefText(brief));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (status === "sent-mail" || status === "sent-api") {
    return (
      <ViewTransition enter={{ "form-next": "step-in-next", default: "none" }} default="none">
        <div className="intake-done" role="status">
          <span className="intake-done-pad" aria-hidden="true" />
          <h2 className="t-h2 mt-6">{status === "sent-api" ? "Brief received." : "Your email app should open now."}</h2>
          <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
            {status === "sent-api"
              ? "We reply by email, usually within one working day, with questions or a first plan."
              : `The brief is filled in and addressed to ${site.email}. Press send there and we'll reply by email, usually within one working day.`}
          </p>
          {status === "sent-mail" ? (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="button" className="btn btn-secondary btn-sm" onClick={copyBrief}>
                {copied ? "Brief copied" : "Copy the brief instead"}
              </button>
              <a className="link text-[0.9375rem]" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </div>
          ) : null}
        </div>
      </ViewTransition>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${uid}-${k}-err`} className="intake-error">
        {errors[k]}
      </p>
    ) : null;
  const described = (k: string) => (errors[k] ? `${uid}-${k}-err` : undefined);

  return (
    <form ref={formRef} className="intake" onSubmit={submit} noValidate aria-label="Project brief">
      <ol className="intake-progress" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s} data-state={i < step ? "done" : i === step ? "current" : "todo"} aria-current={i === step ? "step" : undefined}>
            <span className="intake-progress-pad" aria-hidden="true">
              {i + 1}
            </span>
            <span className="intake-progress-label">{s}</span>
          </li>
        ))}
      </ol>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
        value={brief.website}
        onChange={(e) => set("website", e.target.value)}
      />

      <ViewTransition
        key={step}
        enter={{ "form-next": "step-in-next", "form-prev": "step-in-prev", default: "none" }}
        exit={{ "form-next": "step-out-next", "form-prev": "step-out-prev", default: "none" }}
        default="none"
      >
        <fieldset className="intake-step">
          <legend className="sr-only">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </legend>
          <h2 className="t-h3 outline-none" tabIndex={-1} data-step-title>
            {STEPS[step]}
          </h2>

          {step === 0 ? (
            <div className="mt-6 grid gap-7">
              <div role="radiogroup" aria-label="Kind of project" aria-describedby={described("kind")} className="grid gap-3 sm:grid-cols-2">
                {KINDS.map((k) => (
                  <label key={k.value} className="option-card">
                    <input type="radio" name="kind" value={k.value} checked={brief.kind === k.value} onChange={() => set("kind", k.value)} />
                    <span>
                      <span className="block font-semibold [font-stretch:106%]">{k.value}</span>
                      <span className="mt-0.5 block text-sm text-ink-3">{k.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {err("kind")}
              <div className="grid gap-2">
                <label htmlFor={`${uid}-desc`} className="intake-label">
                  What should the device do, and what&rsquo;s in the way?
                </label>
                <textarea
                  id={`${uid}-desc`}
                  name="description"
                  rows={5}
                  className="intake-input"
                  value={brief.description}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={described("description")}
                  placeholder="For example: a tank-level sensor for 40 sites that must run a year on batteries and report over LTE."
                  onChange={(e) => set("description", e.target.value)}
                />
                {err("description")}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-6 grid gap-7">
              <ChipGroup label="Microcontroller" name="mcu" options={["ESP32 family", "STM32", "Something else", "Not sure yet"]} value={brief.mcu} onChange={(v) => set("mcu", v)} />
              <fieldset className="grid gap-3">
                <legend className="intake-label">Connectivity, any that apply</legend>
                <div className="flex flex-wrap gap-2">
                  {["Wi-Fi", "Bluetooth LE", "LoRa", "Cellular", "Ethernet", "Not sure yet"].map((o) => (
                    <label key={o} className="option-chip">
                      <input
                        type="checkbox"
                        name="links"
                        checked={brief.links.includes(o)}
                        onChange={(e) => set("links", e.target.checked ? [...brief.links, o] : brief.links.filter((x) => x !== o))}
                      />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <ChipGroup label="Power" name="power" options={["Mains", "Battery", "Solar", "Not sure yet"]} value={brief.power} onChange={(v) => set("power", v)} />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-6 grid gap-7">
              <ChipGroup label="How many units" name="quantity" options={["1 to 10", "10 to 100", "100 to 1,000", "Over 1,000"]} value={brief.quantity} onChange={(v) => set("quantity", v)} />
              <ChipGroup label="When you need it" name="timeline" options={["As soon as possible", "Within 3 months", "3 to 6 months", "Just exploring"]} value={brief.timeline} onChange={(v) => set("timeline", v)} />
              <ChipGroup
                label="Budget"
                name="budget"
                options={["Under ৳1 lakh", "৳1 to 5 lakh", "৳5 to 20 lakh", "Over ৳20 lakh", "Budget in USD", "Not sure yet"]}
                value={brief.budget}
                onChange={(v) => set("budget", v)}
              />
              <p className="text-sm text-ink-3">All optional. Rough answers help us reply with something useful.</p>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField id={`${uid}-name`} name="name" label="Your name" autoComplete="name" value={brief.name} error={errors.name} errorId={described("name")} onChange={(v) => set("name", v)} />
              <TextField id={`${uid}-email`} name="email" type="email" label="Email" autoComplete="email" value={brief.email} error={errors.email} errorId={described("email")} onChange={(v) => set("email", v)} />
              <TextField id={`${uid}-company`} name="company" label="Company or lab (optional)" autoComplete="organization" value={brief.company} onChange={(v) => set("company", v)} />
              <TextField id={`${uid}-phone`} name="phone" type="tel" label="Phone or WhatsApp (optional)" autoComplete="tel" value={brief.phone} onChange={(v) => set("phone", v)} />
            </div>
          ) : null}
        </fieldset>
      </ViewTransition>

      {status === "failed" ? (
        <p className="intake-error mt-6" role="alert">
          The brief didn&rsquo;t send. Email it to {site.email} instead, or try again in a minute.
        </p>
      ) : null}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        {step > 0 ? (
          <button type="button" className="btn btn-secondary" onClick={() => go(step - 1)}>
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          <span className="btn-pad" aria-hidden="true" />
          {step < STEPS.length - 1 ? `Next: ${STEPS[step + 1].toLowerCase()}` : status === "sending" ? "Sending" : "Send the brief"}
        </button>
      </div>
    </form>
  );
}

function ChipGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="intake-label">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="option-chip">
            <input type="radio" name={name} checked={value === o} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function TextField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  error,
  errorId,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  error?: string;
  errorId?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="intake-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="intake-input"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p id={errorId} className="intake-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
