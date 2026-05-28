import type { BookListItemProps } from "./types";
import { readerThemes } from "../../theme";

export default function BookListItem({
  book,
  isActive,
  onSelect,
  theme,
}: BookListItemProps) {
  const themeColors = readerThemes[theme];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="w-full cursor-pointer rounded-lg border px-4 py-3 text-left transition-opacity hover:opacity-80"
        style={{
          backgroundColor: themeColors.foreground,
          borderColor: themeColors.foreground,
          color: themeColors.background,
        }}
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
    </li>
  );
}
