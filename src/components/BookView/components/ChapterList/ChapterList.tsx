import type { ChapterListProps } from "./types";

export default function ChapterList({
  items,
  onSelect,
  themeColors,
}: ChapterListProps) {
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <button
            type="button"
            onClick={() => onSelect(item.href)}
            className="w-full cursor-pointer rounded-md px-3 py-2 text-left text-sm transition-opacity hover:opacity-80"
            style={{ color: themeColors.foreground }}
          >
            {item.label}
          </button>
          {item.subitems && item.subitems.length > 0 && (
            <div
              className="ml-3 border-l pl-2"
              style={{ borderColor: themeColors.muted }}
            >
              <ChapterList
                items={item.subitems}
                onSelect={onSelect}
                themeColors={themeColors}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
