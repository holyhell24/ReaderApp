import JSZip from "jszip";
import type { BookMetadata } from "../types/types";

export function isEpubFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".epub") ||
    file.type === "application/epub+zip" ||
    file.type === "application/epub"
  );
}

function getXmlText(document: Document, selector: string): string | undefined {
  return document.querySelector(selector)?.textContent?.trim() || undefined;
}

function getMetadataText(document: Document, tagName: string): string | undefined {
  const namespacedValue = document
    .getElementsByTagNameNS("*", tagName)
    .item(0)
    ?.textContent?.trim();

  if (namespacedValue) return namespacedValue;

  return getXmlText(document, tagName);
}

function stripHtml(value: string): string {
  const document = new DOMParser().parseFromString(value, "text/html");
  return document.body.textContent?.replace(/\s+/g, " ").trim() ?? value;
}

function humanizeFileName(fileName: string): string {
  return fileName
    .replace(/\.epub$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/[[\]{}()]/g, "")
    .replace(/#/g, " #")
    .replace(/\s+/g, " ")
    .trim();
}

export async function parseEpubMetadataFromData(
  data: ArrayBuffer,
  fileName: string,
): Promise<BookMetadata> {
  const fallbackTitle = humanizeFileName(fileName);
  try {
    const zip = await JSZip.loadAsync(data.slice(0));
    const containerXml = await zip
      .file("META-INF/container.xml")
      ?.async("string");

    if (!containerXml) return { title: fallbackTitle };

    const parser = new DOMParser();
    const containerDocument = parser.parseFromString(
      containerXml,
      "application/xml",
    );
    const opfPath = containerDocument
      .querySelector("rootfile")
      ?.getAttribute("full-path");

    if (!opfPath) return { title: fallbackTitle };

    const opfXml = await zip.file(opfPath.replace(/^\/+/, ""))?.async("string");

    if (!opfXml) return { title: fallbackTitle };

    const opfDocument = parser.parseFromString(opfXml, "application/xml");
    const title = getMetadataText(opfDocument, "title");
    const author = getMetadataText(opfDocument, "creator");
    const description = getMetadataText(opfDocument, "description");

    return {
      author,
      description: description ? stripHtml(description) : undefined,
      title: title || fallbackTitle,
    };
  } catch {
    return { title: fallbackTitle };
  }
}

export async function parseEpubMetadata(file: File): Promise<BookMetadata> {
  return parseEpubMetadataFromData(await file.arrayBuffer(), file.name);
}
