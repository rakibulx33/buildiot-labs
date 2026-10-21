"use client";

import { addTransitionType, startTransition, useEffect, useId, useRef, useState, ViewTransition } from "react";
import { site } from "@/content/site";

type Brief = {
  services: string[];
  stage: string;
  description: string;
  timeline: string;
  budget: string;
  nda: boolean;
  name: string;
  email: string;
  company: string;
  website: string; // honeypot
};

const EMPTY: Brief = {
  services: [],
  stage: "",
  description: "",
  timeline: "",
  budget: "",
  nda: false,
  name: "",
  email: "",
  company: "",
  website: "",
};

const STEPS = ["The project", "Timing and budget", "About you"] as const;

const SERVICES = [
  "Hardware R&D",
  "PCB design",
  "Firmware",
  "IoT software and cloud",
  "Consulting",
  "Unsure",
];
const STAGES = ["Idea", "Existing design", "Prototype", "Pilot", "Product in field"];
const TIMELINES = ["Flexible", "2\u20134 weeks", "1\u20133 months", "3+ months"];
const BUDGETS = ["Under USD 2,000", "USD 2,000\u201310,000", "USD 10,000\u201350,000", "Over USD 50,000", "Prefer to discuss"];

const LIMITS = { name: [2, 100], company: [0, 120], description: [30, 4000] } as const;

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

function briefText(b: Brief): string {
  const line = (k: string, v: string) => (v ? `${k}: ${v}` : null);
  return [
    line("Services", b.services.join(", ")),
    line("Project stage", b.stage),
    "",
    b.description.trim(),
    "",
    line("Timeline", b.timeline),
    line("Budget range", b.budget),
    line("NDA required", b.nda ? "Yes" : ""),
    "",
    line("Name", b.name.trim()),
    line("Email", b.email.trim()),
    line("Company or project", b.company.trim()),
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
      if (brief.services.length === 0) e.services = "Choose at least one service, or \u201CUnsure\u201D.";
      const n = brief.description.trim().length;
      if (n < LIMITS.description[0])
        e.description = `Describe the device and the problem in a few sentences (${LIMITS.description[0]} characters or more; you have ${n}).`;
      else if (n > LIMITS.description[1]) e.description = `Please keep the brief under ${LIMITS.description[1]} characters.`;
    }
    if (s === 2) {
      const n = brief.name.trim().length;
      if (n < LIMITS.name[0] || n > LIMITS.name[1]) e.name = "Add your full name (2 to 100 characters).";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) e.email = "Add a work email address we can reply to.";
      if (brief.company.trim().length > LIMITS.company[1]) e.company = "Keep this under 120 characters.";
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
    const e = validate(2);
    if (Object.keys(e).length) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    if (brief.website) return; // a bot filled the hidden field
    const subject = `Project brief: ${brief.services.join(", ")}, ${brief.name.trim()}`;
    if (ENDPOINT) {
      setStatus("sending");
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...brief, services: brief.services.join(", "), _subject: subject, message: briefText(brief) }),
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
          <h2 className="t-h2 mt-6">{status === "sent-api" ? "Brief sent." : "Your email app should open now."}</h2>
          <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
            {status === "sent-api"
              ? "Your brief reached our inbox. We reply by email with questions or a first plan."
              : `The brief is filled in and addressed to ${site.email}. It has not been sent until you press send in your email app. We then reply by email.`}
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
              <fieldset className="grid gap-3" aria-describedby={described("services")}>
                <legend className="intake-label">Service needed (choose any that apply)</legend>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((o) => (
                    <label key={o} className="option-chip">
                      <input
                        type="checkbox"
                        name="services"
                        checked={brief.services.includes(o)}
                        onChange={(e) =>
                          set(
                            "services",
                            e.target.checked
                              ? o === "Unsure"
                                ? ["Unsure"]
                                : [...brief.services.filter((x) => x !== "Unsure"), o]
                              : brief.services.filter((x) => x !== o),
                          )
                        }
                      />
                      <span>{o}</span>
                    </label>
                  ))}
                </div>
                {err("services")}
              </fieldset>
              <ChipGroup label="Project stage (optional)" name="stage" options={STAGES} value={brief.stage} onChange={(v) => set("stage", v)} />
              <div className="grid gap-2">
                <label htmlFor={`${uid}-desc`} className="intake-label">
                  Technical brief
                </label>
                <textarea
                  id={`${uid}-desc`}
                  name="description"
                  rows={6}
                  maxLength={LIMITS.description[1]}
                  className="intake-input"
                  value={brief.description}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={[`${uid}-desc-hint`, described("description")].filter(Boolean).join(" ")}
                  placeholder="For example: a tank-level sensor for 40 sites that must run a year on batteries and report over LTE."
                  onChange={(e) => set("description", e.target.value)}
                />
                <p id={`${uid}-desc-hint`} className="text-sm text-ink-3">
                  {brief.description.trim().length} / {LIMITS.description[1]} characters, 30 minimum. Please don&rsquo;t paste
                  unpublished schematics or confidential files here; we&rsquo;ll agree how to share them first.
                </p>
                {err("description")}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="mt-6 grid gap-7">
              <ChipGroup label="Timeline (optional)" name="timeline" options={TIMELINES} value={brief.timeline} onChange={(v) => set("timeline", v)} />
              <ChipGroup label="Budget range (optional)" name="budget" options={BUDGETS} value={brief.budget} onChange={(v) => set("budget", v)} />
              <label className="option-chip w-fit">
                <input type="checkbox" name="nda" checked={brief.nda} onChange={(e) => set("nda", e.target.checked)} />
                <span>An NDA is required before we share design files</span>
              </label>
              <p className="text-sm text-ink-3">
                All optional. You never have to disclose a budget; &ldquo;Prefer to discuss&rdquo; is a fine answer.
              </p>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <TextField id={`${uid}-name`} name="name" label="Full name" autoComplete="name" maxLength={LIMITS.name[1]} value={brief.name} error={errors.name} errorId={described("name")} onChange={(v) => set("name", v)} />
              <TextField id={`${uid}-email`} name="email" type="email" label="Work email" autoComplete="email" value={brief.email} error={errors.email} errorId={described("email")} onChange={(v) => set("email", v)} />
              <TextField id={`${uid}-company`} name="company" label="Company or project name (optional)" autoComplete="organization" maxLength={LIMITS.company[1]} value={brief.company} error={errors.company} errorId={described("company")} onChange={(v) => set("company", v)} />
            </div>
          ) : null}
        </fieldset>
      </ViewTransition>

      {status === "failed" ? (
        <p className="intake-error mt-6" role="alert">
          The brief was not delivered. Nothing has been sent. Email it to {site.email} instead, or try again in a minute.
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
  maxLength,
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
  maxLength?: number;
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
        maxLength={maxLength}
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
