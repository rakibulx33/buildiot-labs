export type Engagement = {
  slug: string;
  name: string;
  summary: string;
  forWho: string;
  youGet: string[];
  examples: string[];
  length: string;
  pricing: string;
};

export const engagements: Engagement[] = [
  {
    slug: "review",
    name: "Review",
    summary: "A close look at a design, firmware or software you already have.",
    forWho: "Teams with a design or device that misbehaves, or that want a second opinion before they commit.",
    youGet: [
      "Measurements of the problem, with methods",
      "A written report with the causes we found",
      "A ranked list of fixes, cheapest first",
    ],
    examples: [
      "A PCB layout and DFM review before fabrication",
      "A firmware review for a device that drains its battery or resets",
      "A feasibility report for a connected product idea",
    ],
    length: "Agreed in the written scope",
    pricing: "Proposal-based",
  },
  {
    slug: "build-sprint",
    name: "Build sprint",
    summary: "A defined piece of work, delivered against written test criteria and milestones.",
    forWho: "A new board, a firmware release, a cloud platform, or a complete first version of a connected product.",
    youGet: ["Working designs, firmware or software, as scoped", "Test notes against the scope", "A handover pack"],
    examples: [
      "A schematic and PCB design with fabrication files",
      "Firmware for a sensor node, with OTA updates",
      "A device dashboard and API with deployment guide",
    ],
    length: "Agreed in the written scope",
    pricing: "Proposal-based",
  },
  {
    slug: "retainer",
    name: "Retainer",
    summary: "A set number of engineering days every month.",
    forWho: "Teams with a product in development or in the field that needs steady engineering support.",
    youGet: ["A monthly plan agreed with you", "Regular bench notes", "Agreed response times, written into the plan"],
    examples: [
      "Ongoing firmware and cloud work on a product in the field",
      "Remote engineering support for your own team",
      "Regular design reviews as a product evolves",
    ],
    length: "Month to month",
    pricing: "Proposal-based",
  },
];
