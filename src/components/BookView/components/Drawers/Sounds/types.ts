import type { AmbienceType } from "../../../../../enums";

export interface SoundPreset {
  label: string;
  volumes: Partial<Record<AmbienceType, number>>;
}

export interface SoundPresetGroup {
  label: string;
  presets: SoundPreset[];
}
