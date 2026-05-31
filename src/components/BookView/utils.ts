import type { SoundScene } from "../../types/types";
import type { ReaderTocItem, TocMatch } from "./types";

function getHrefPath(href: string): string {
  return href.split("#")[0].split("?")[0].toLowerCase();
}

function normalizeSceneText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function flattenToc(
  items: ReaderTocItem[],
  parentLabel?: string,
): TocMatch[] {
  return items
    .flatMap((item) => {
      if (item.subitems?.length) {
        return flattenToc(item.subitems, item.label);
      }

      return [
        {
          href: item.href,
          index: 0,
          label: item.label,
          parentLabel,
        },
      ];
    })
    .map((item, index) => ({
      ...item,
      index,
    }));
}

export function findTocMatch(
  tocItems: TocMatch[],
  href: string,
): TocMatch | null {
  const hrefPath = getHrefPath(href);
  const exactMatch = tocItems.find((item) => item.href === href);

  if (exactMatch) return exactMatch;

  return (
    tocItems.find((item) => getHrefPath(item.href) === hrefPath) ??
    tocItems.find((item) => hrefPath.endsWith(getHrefPath(item.href))) ??
    null
  );
}

export function findSoundScene(
  tocItem: TocMatch | null,
  soundScenes: SoundScene[],
) {
  if (!tocItem) return null;

  const labelMatch = tocItem.label.match(/^(.*?)\s*[-â€“â€”]\s*(\d+)$/);
  const subchapterFromLabel = tocItem.label.match(/\d+/)?.[0];
  const chapter = labelMatch?.[1] ?? tocItem.parentLabel ?? tocItem.label;
  const subchapter = Number(labelMatch?.[2] ?? subchapterFromLabel ?? 1);

  if (chapter && Number.isFinite(subchapter)) {
    const scene = soundScenes.find(
      (item) =>
        normalizeSceneText(item.chapter) === normalizeSceneText(chapter) &&
        item.subchapter === subchapter,
    );

    if (scene) return scene;
  }

  const wholeChapterScene = soundScenes.find(
    (item) =>
      normalizeSceneText(item.chapter) === normalizeSceneText(tocItem.label) &&
      item.subchapter === 1,
  );

  if (wholeChapterScene) return wholeChapterScene;

  return soundScenes[tocItem.index] ?? null;
}
