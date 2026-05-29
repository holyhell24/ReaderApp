import {
  MAX_READER_FONT_SIZE,
  MIN_READER_FONT_SIZE,
  READER_FONT_SIZE_STEP,
  readerFonts,
  readerIntervals,
  readerLineHeights,
  readerThemes,
  type ReaderFontFamily,
  type ReaderInterval,
  type ReaderLineHeight,
  type ReaderTheme,
} from "../../../../../theme";
import type { SettingsDrawerProps } from "../types";

export default function Settings({
  onClose,
  onSettingsChange,
  onSettingsReset,
  onThemeChange,
  settings,
  theme,
  themeColors,
}: SettingsDrawerProps) {
  const isBionicalSelected = settings.fontFamily === "fast_serif";

  const handleFontSizeChange = (change: number) => {
    onSettingsChange({
      ...settings,
      fontSize: Math.min(
        MAX_READER_FONT_SIZE,
        Math.max(MIN_READER_FONT_SIZE, settings.fontSize + change),
      ),
    });
  };

  const handleFontFamilyChange = (fontFamily: ReaderFontFamily) => {
    onSettingsChange({
      ...settings,
      fontFamily,
      interval: fontFamily === "fast_serif" ? "tight" : settings.interval,
    });
  };

  const handleIntervalChange = (interval: ReaderInterval) => {
    if (isBionicalSelected) {
      return;
    }

    onSettingsChange({
      ...settings,
      interval,
    });
  };

  const handleLineHeightChange = (lineHeight: ReaderLineHeight) => {
    onSettingsChange({
      ...settings,
      lineHeight,
    });
  };

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
      <div className="mt-6">
        <h3
          className="mb-2 text-sm font-medium"
          style={{ color: themeColors.foreground }}
        >
          Interval
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(readerIntervals) as ReaderInterval[]).map((interval) => (
            <button
              key={interval}
              type="button"
              disabled={isBionicalSelected}
              onClick={() => handleIntervalChange(interval)}
              className="cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor:
                  settings.interval === interval
                    ? themeColors.foreground
                    : "transparent",
                borderColor:
                  settings.interval === interval
                    ? themeColors.foreground
                    : themeColors.muted,
                color:
                  settings.interval === interval
                    ? themeColors.background
                    : themeColors.foreground,
              }}
            >
              {readerIntervals[interval].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3
          className="mb-2 text-sm font-medium"
          style={{ color: themeColors.foreground }}
        >
          Line height
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(readerLineHeights) as ReaderLineHeight[]).map(
            (lineHeight) => (
              <button
                key={lineHeight}
                type="button"
                onClick={() => handleLineHeightChange(lineHeight)}
                className="cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor:
                    settings.lineHeight === lineHeight
                      ? themeColors.foreground
                      : "transparent",
                  borderColor:
                    settings.lineHeight === lineHeight
                      ? themeColors.foreground
                      : themeColors.muted,
                  color:
                    settings.lineHeight === lineHeight
                      ? themeColors.background
                      : themeColors.foreground,
                }}
              >
                {readerLineHeights[lineHeight].label}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="mt-6">
        <h3
          className="mb-2 text-sm font-medium"
          style={{ color: themeColors.foreground }}
        >
          Font size
        </h3>
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
          <button
            type="button"
            onClick={() => handleFontSizeChange(-READER_FONT_SIZE_STEP)}
            className="h-11 cursor-pointer rounded-lg border text-lg font-medium transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={settings.fontSize <= MIN_READER_FONT_SIZE}
            style={{
              borderColor: themeColors.muted,
              color: themeColors.foreground,
            }}
          >
            -
          </button>
          <div
            className="rounded-lg border px-3 py-2 text-center text-sm font-medium"
            style={{
              borderColor: themeColors.muted,
              color: themeColors.foreground,
            }}
          >
            {settings.fontSize}px
          </div>
          <button
            type="button"
            onClick={() => handleFontSizeChange(READER_FONT_SIZE_STEP)}
            className="h-11 cursor-pointer rounded-lg border text-lg font-medium transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={settings.fontSize >= MAX_READER_FONT_SIZE}
            style={{
              borderColor: themeColors.muted,
              color: themeColors.foreground,
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-6">
        <h3
          className="mb-2 text-sm font-medium"
          style={{ color: themeColors.foreground }}
        >
          Font
        </h3>
        <div className="grid gap-2">
          {(Object.keys(readerFonts) as ReaderFontFamily[]).map((fontFamily) => (
            <button
              key={fontFamily}
              type="button"
              onClick={() => handleFontFamilyChange(fontFamily)}
              className="cursor-pointer rounded-lg border px-3 py-2 text-left text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                backgroundColor:
                  settings.fontFamily === fontFamily
                    ? themeColors.foreground
                    : "transparent",
                borderColor:
                  settings.fontFamily === fontFamily
                    ? themeColors.foreground
                    : themeColors.muted,
                color:
                  settings.fontFamily === fontFamily
                    ? themeColors.background
                    : themeColors.foreground,
                fontFamily: readerFonts[fontFamily].cssValue,
              }}
            >
              {readerFonts[fontFamily].label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onSettingsReset}
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
