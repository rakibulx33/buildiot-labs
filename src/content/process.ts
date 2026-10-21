export type Step = {
  name: string;
  detail: string;
  youGet: string;
};

/** How a project runs. This is a real sequence, so it is numbered. */
export const steps: Step[] = [
  {
    name: "Brief",
    detail:
      "You tell us what the device must do, where it will live and what it has to cost. The short form on our contact page is enough to start.",
    youGet: "Our questions back by email, or an honest no if it isn't a fit.",
  },
  {
    name: "Scope",
    detail:
      "We write down what we'll build, how we'll test it, what it costs and when it's due. Work starts only when you've agreed to it in writing.",
    youGet: "A written scope with test criteria and a fixed price or monthly rate.",
  },
  {
    name: "Build",
    detail:
      "We build in short increments and send bench notes as we go, so you see progress and problems while they're still cheap to fix.",
    youGet: "Access to the code as it grows, and regular bench notes.",
  },
  {
    name: "Test",
    detail:
      "We test against the criteria in the scope and record how each number was measured: the device, the conditions, the instrument and the date.",
    youGet: "A test report with methods, results, and what failed on the way.",
  },
  {
    name: "Hand over",
    detail:
      "Source, documentation and a walkthrough, so your team can build, flash and maintain the device without us in the room.",
    youGet: "A handover pack: source, build steps, wiring, parts list and test report.",
  },
];
