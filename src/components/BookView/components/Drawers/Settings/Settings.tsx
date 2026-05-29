import { readerThemes, type ReaderTheme } from "../../../../../theme";
import type { SettingsDrawerProps } from "../types";

export default function Settings({
  onClose,
  onThemeChange,
  theme,
  themeColors,
}: SettingsDrawerProps) {
  return (
    <aside
      id="book-settings-drawer"
      aria-label="Book settings"
      className="fixed inset-y-0 right-0 z-30 flex w-80 max-w-[85vw] flex-col p-4 shadow-xl"
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
          Settings
        </h2>
        <button
          type="button"
          aria-label="Close settings"
          onClick={onClose}
          className="cursor-pointer rounded-full px-3 py-1 text-sm transition-opacity hover:opacity-80"
          style={{ color: themeColors.muted }}
        >
          Close
        </button>
      </div>
      <div>
        <h3
          className="mb-2 text-sm font-medium"
          style={{ color: themeColors.foreground }}
        >
          Theme
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(readerThemes) as ReaderTheme[]).map((themeName) => (
            <button
              key={themeName}
              type="button"
              onClick={() => onThemeChange(themeName)}
              className="cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor:
                  theme === themeName ? themeColors.foreground : "transparent",
                borderColor:
                  theme === themeName
                    ? themeColors.foreground
                    : themeColors.muted,
                color:
                  theme === themeName
                    ? themeColors.background
                    : themeColors.foreground,
              }}
            >
              {readerThemes[themeName].label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onThemeChange("light")}
        className="mt-6 cursor-pointer rounded-lg border px-4 py-2 text-left text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        Reset
      </button>
    </aside>
  );
}
