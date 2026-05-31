import type { BookListItemProps } from "./types";
import { readerThemes } from "../../theme";

export default function BookListItem({
  book,
  isActive,
  onRemove,
  onSelect,
  theme,
}: BookListItemProps) {
  const themeColors = readerThemes[theme];

  return (
    <li
      className="rounded-lg border px-4 py-3"
      style={{
        backgroundColor: themeColors.foreground,
        borderColor: themeColors.foreground,
        color: themeColors.background,
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onSelect}
          className="min-w-0 flex-1 cursor-pointer text-left transition-opacity hover:opacity-80"
          style={{ color: themeColors.background }}
        >
          <p className="font-medium">{book.title}</p>
          {book.author && (
            <p className="text-sm">
              <span>Author: {book.author}</span>
            </p>
          )}
          {book.description && (
            <p
              className="mt-1 line-clamp-4 text-sm"
              style={{
                color: isActive ? themeColors.background : themeColors.muted,
              }}
            >
              {book.description}
            </p>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            borderColor: themeColors.background,
            color: themeColors.background,
          }}
        >
          X
        </button>
      </div>
    </li>
  );
}
