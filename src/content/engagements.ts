export type Engagement = {
  slug: string;
  name: string;
  summary: string;
  forWho: string;
  youGet: string[];
  length: string;
  pricing: string;
};

export const engagements: Engagement[] = [
  {
    slug: "review",
    name: "Review",
    summary: "A close look at firmware, power or a data pipeline you already have.",
    forWho: "Teams with a working device that drains its battery, drops data or resets in the field.",
    youGet: [
      "Measurements of the problem, with methods",
      "A written report with the causes we found",
      "A ranked list of fixes, cheapest first",
    ],
    length: "Usually one to two weeks",
    pricing: "Fixed price",
  },
  {
    slug: "build-sprint",
    name: "Build sprint",
    summary: "A defined piece of work, delivered against written test criteria.",
    forWho: "A new feature, a prototype, a pipeline, or a complete first version of a device.",
    youGet: ["Working firmware or hardware", "A test report against the scope", "A handover pack"],
    length: "Usually two to eight weeks",
    pricing: "Fixed price per scope",
  },
  {
    slug: "retainer",
    name: "Retainer",
    summary: "A set number of engineering days every month.",
    forWho: "Teams with a product in the field that needs steady firmware and pipeline work.",
    youGet: ["A monthly plan agreed with you", "Regular bench notes", "Priority on field issues"],
    length: "Month to month",
    pricing: "Monthly rate",
  },
];
