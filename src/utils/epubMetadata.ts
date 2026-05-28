import type { BookMetadata } from "../types/types";

export function isEpubFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".epub") ||
    file.type === "application/epub+zip" ||
    file.type === "application/epub"
  );
}

export async function parseEpubMetadata(file: File): Promise<BookMetadata> {
  return {
    title: file.name.replace(/\.epub$/i, ""),
  };
}
