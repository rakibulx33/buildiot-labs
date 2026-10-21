import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type NoteMeta = {
  /** Shorter title for search results and browser tabs. */
  seoTitle?: string;
  entry: number;
  date: string;
  title: string;
  summary: string;
  topics: string[];
};

export type Note = { slug: string; meta: NoteMeta; Content: ComponentType };

const NOTES_DIR = path.join(process.cwd(), "src/content/lab-notes");

export function noteSlugs(): string[] {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export async function getNote(slug: string): Promise<Note> {
  const mod = (await import(`@/content/lab-notes/${slug}.mdx`)) as {
    default: ComponentType;
    meta: NoteMeta;
  };
  return { slug, meta: mod.meta, Content: mod.default };
}

/** All notes, newest entry first. */
export async function allNotes(): Promise<Note[]> {
  const notes = await Promise.all(noteSlugs().map(getNote));
  return notes.sort((a, b) => b.meta.entry - a.meta.entry);
}
