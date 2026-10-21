export type Faq = { q: string; a: string };

/** Answers stay within the agreed brand and scope rules: remote delivery, written scope, no unverified claims. */
export const faqs: Faq[] = [
  {
    q: "What do you deliver?",
    a: "Depending on the project: editable schematics and PCB files, firmware and application source code, deployment instructions, technical documentation and test results. The exact list is agreed in a written scope before work begins.",
  },
  {
    q: "Do you manufacture or assemble boards?",
    a: "No. We design them. For PCB work we deliver digital output such as Gerber and drill files and a bill of materials, plus fabrication and assembly data when scoped, so a fabrication house of your choice can build them. “Manufacturing-ready files” means that digital output, not a manufacturing service.",
  },
  {
    q: "How do you work with clients?",
    a: "Remotely. We deliver designs, source files, integrations, documentation, advisory and remote testing assistance. We do not offer installation on site.",
  },
  {
    q: "Who owns the work?",
    a: "Access, ownership and handover terms are agreed in writing before work begins, and each engagement’s deliverables are subject to the agreed scope and test criteria.",
  },
  {
    q: "Do you sign NDAs?",
    a: "We can discuss NDA arrangements before reviewing confidential design files. Please don’t paste unpublished schematics into the first-contact form; we’ll agree how to share them first.",
  },
  {
    q: "Can you work on a design or firmware someone else wrote?",
    a: "Yes. A review is usually the right first step: we read the design or code, measure where we can, and give you a ranked list of findings before anyone rewrites anything.",
  },
  {
    q: "How is a project priced?",
    a: "As a written proposal after we read your brief, with scope, milestones and acceptance criteria. We publish no universal prices or timelines because they depend on the work.",
  },
  {
    q: "What if the scope changes halfway?",
    a: "We write the change down, with its effect on price and dates, and continue only when you agree.",
  },
  {
    q: "What should I put in my project brief?",
    a: "The device or product idea, the problem, your stage (idea, existing design, prototype, pilot or in the field) and any constraints such as power, size or cost. Budget is optional.",
  },
];
