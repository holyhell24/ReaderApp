import ChapterList from "../../ChapterList";
import type { ChaptersDrawerProps } from "../types";

export default function Chapters({
  onChapterSelect,
  onClose,
  themeColors,
  toc,
}: ChaptersDrawerProps) {
  return (
    <aside
      id="book-chapters-drawer"
      aria-label="Book chapters"
      className="fixed inset-y-0 right-0 z-30 flex w-96 max-w-[85vw] flex-col p-4 shadow-xl"
      style={{
        backgroundColor: themeColors.background,
        color: themeColors.foreground,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          className="text-base font-semibold"
          style={{ color: themeColors.foreground }}
        >
          Chapters
        </h2>
        <button
          type="button"
          aria-label="Close chapters"
          onClick={onClose}
          className="cursor-pointer rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
          style={{ color: themeColors.muted }}
        >
          Close
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto">
        {toc.length > 0 ? (
          <ChapterList
            items={toc}
            onSelect={onChapterSelect}
            themeColors={themeColors}
          />
        ) : (
          <p className="text-sm" style={{ color: themeColors.muted }}>
            No chapters found.
          </p>
        )}
      </nav>
    </aside>
  );
}
