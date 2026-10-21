export type Step = {
  name: string;
  detail: string;
  youGet: string;
  /** What we need coming in. */
  input: string;
  /** How the step is accepted as done. */
  accept: string;
};

/** How a project runs. This is a real sequence, so it is numbered. */
export const steps: Step[] = [
  {
    name: "Brief",
    detail:
      "You tell us what the device must do, where it will live and what constraints apply. The short form on our contact page is enough to start.",
    youGet: "Our questions back by email, or an honest no if it isn't a fit.",
    input: "A short technical brief: the device or idea, the problem and any constraints.",
    accept: "You confirm we have understood the problem.",
  },
  {
    name: "Scope",
    detail:
      "We write down what we'll build, how we'll test it, what it costs and the milestones. Work starts only when you've agreed to it in writing.",
    youGet: "A written scope with test criteria, milestones and a price proposal.",
    input: "Answers to our questions, and any existing design files or code.",
    accept: "You agree the written scope, milestones and acceptance criteria.",
  },
  {
    name: "Build",
    detail:
      "We build in short increments and send bench notes as we go, so you see progress and problems while they're still cheap to fix.",
    youGet: "Access to the code as it grows, and regular bench notes.",
    input: "Decisions and access you owe us, by the dates in the scope.",
    accept: "Each milestone is signed off against the scope.",
  },
  {
    name: "Test",
    detail:
      "We test against the criteria in the scope and record how each number was measured: the device, the conditions, the instrument and the date.",
    youGet: "A test report with methods, results, and what failed on the way.",
    input: "A build that meets the milestone, and the test criteria from the scope.",
    accept: "Results meet the written criteria, or the gaps are listed and agreed.",
  },
  {
    name: "Hand over",
    detail:
      "Source, documentation and a walkthrough, so your team can build, flash and maintain the device without us in the room.",
    youGet: "A handover pack: source files, build steps, documentation and test results, as scoped.",
    input: "Passing results and your agreement on the final deliverables.",
    accept: "You can build, flash and maintain the work using the handover pack.",
  },
];
