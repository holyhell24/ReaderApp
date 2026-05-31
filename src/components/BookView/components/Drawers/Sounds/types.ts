import { SoundCategory, type AmbienceType } from "../../../../../enums";

export interface SoundPreset {
  label: string;
  volumes: Partial<Record<AmbienceType, number>>;
}

export interface SoundPresetGroup {
  label: string;
  presets: SoundPreset[];
}

export interface SoundSettings {
  isMuted: boolean;
  isRunning: boolean;
  volume: number;
}

export interface ApplyPresetOptions {
  play?: boolean;
}

export const soundCategories: SoundCategory[] = [
  SoundCategory.Nature,
  SoundCategory.Rain,
  SoundCategory.Animals,
  SoundCategory.Urban,
  SoundCategory.Places,
  SoundCategory.Things,
  SoundCategory.LongAmbients,
];
