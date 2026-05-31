import { SoundCategory } from "../../../../../enums";
import type { SoundsDrawerProps } from "../types";
import type { SoundSettings } from "./types";

const DEFAULT_MASTER_VOLUME_LEVEL = 1;
const SOUND_SETTINGS_STORAGE_KEY = "reader-app-sound-settings";

export function clampVolume(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

export function loadSoundSettings(): SoundSettings {
  try {
    const raw = localStorage.getItem(SOUND_SETTINGS_STORAGE_KEY);
    if (!raw) {
      return {
        isMuted: false,
        isRunning: true,
        volume: DEFAULT_MASTER_VOLUME_LEVEL,
      };
    }

    const settings = JSON.parse(raw) as Partial<SoundSettings>;

    return {
      isMuted: settings.isMuted ?? false,
      isRunning: settings.isRunning ?? true,
      volume:
        typeof settings.volume === "number"
          ? clampVolume(settings.volume)
          : DEFAULT_MASTER_VOLUME_LEVEL,
    };
  } catch {
    return {
      isMuted: false,
      isRunning: true,
      volume: DEFAULT_MASTER_VOLUME_LEVEL,
    };
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function categoryLabel(category: SoundCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function presetButtonStyles(
  isActive: boolean,
  themeColors: SoundsDrawerProps["themeColors"],
) {
  return {
    backgroundColor: isActive ? themeColors.foreground : "transparent",
    borderColor: isActive ? themeColors.foreground : themeColors.muted,
    color: isActive ? themeColors.background : themeColors.foreground,
  };
}
