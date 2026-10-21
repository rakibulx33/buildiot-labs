import { steps } from "@/content/process";

/** The five steps of a project, joined by a trace that fills as you read. */
export function ProcessTrace() {
  return (
    <ol className="process">
      <span className="process-fill" aria-hidden="true" />
      {steps.map((step, i) => (
        <li key={step.name} className="process-step">
          <span className="process-pad" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            <h3 className="t-h3">
              <span className="sr-only">Step {i + 1}: </span>
              {step.name}
            </h3>
            <p className="mt-3 max-w-[36rem] text-ink-2">{step.detail}</p>
            <p className="mt-3 max-w-[36rem] text-[0.9375rem]">
              <span className="font-semibold [font-stretch:106%]">You get: </span>
              {step.youGet}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
