import ePub from "epubjs";
import type { BookMetadata } from "../types/types";

function toOptionalString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (Array.isArray(value)) {
    const joined = value.map(String).join(", ").trim();
    return joined ? joined : undefined;
  }
  if (value != null) {
    const trimmed = String(value).trim();
    return trimmed ? trimmed : undefined;
  }
  return undefined;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("EPUB parse timeout")), ms);
    }),
  ]);
}

export function isEpubFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".epub") ||
    file.type === "application/epub+zip" ||
    file.type === "application/epub"
  );
}

export async function parseEpubMetadata(file: File): Promise<BookMetadata> {
  const fallbackTitle = file.name.replace(/\.epub$/i, "");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const epubBook = ePub(arrayBuffer);
    await withTimeout(epubBook.ready, 10_000);
    const metadata = await withTimeout(epubBook.loaded.metadata, 5_000);
    epubBook.destroy();

    return {
      title: toOptionalString(metadata.title) ?? fallbackTitle,
      author: toOptionalString(metadata.creator),
      description: toOptionalString(metadata.description),
    };
  } catch {
    return { title: fallbackTitle };
  }
}
