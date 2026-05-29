import { AmbienceType } from "../../../../../enums";
import type { SoundPreset, SoundPresetGroup } from "./types";

export const soundPresets: SoundPreset[] = [
  {
    label: "Forest",
    volumes: {
      [AmbienceType.Birds]: 0.35,
      [AmbienceType.Crickets]: 0.25,
      [AmbienceType.WindInTrees]: 0.1,
      [AmbienceType.Wind]: 0.1,
    },
  },
  {
    label: "Forest Night",
    volumes: {
      [AmbienceType.Crickets]: 0.7,
      [AmbienceType.Jungle]: 0.05,
      [AmbienceType.WindInTrees]: 0.1,
      [AmbienceType.Wind]: 0.1,
      [AmbienceType.Owl]: 0.5,
    },
  },
  {
    label: "River",
    volumes: {
      [AmbienceType.Birds]: 0.1,
      [AmbienceType.Crickets]: 0.25,
      [AmbienceType.Frog]: 0.2,
      [AmbienceType.River]: 0.2,
      [AmbienceType.Wind]: 0.2,
    },
  },
  {
    label: "River Night",
    volumes: {
      [AmbienceType.Crickets]: 1,
      [AmbienceType.Jungle]: 0.05,
      [AmbienceType.Frog]: 0.2,
      [AmbienceType.River]: 0.2,
      [AmbienceType.Wind]: 0.2,
    },
  },
  {
    label: "Light rain",
    volumes: {
      [AmbienceType.LightRain]: 0.4,
      [AmbienceType.HeavyRain]: 0.15,
      [AmbienceType.Wind]: 0.15,
    },
  },
  {
    label: "Heavy rain",
    volumes: {
      [AmbienceType.LightRain]: 0.4,
      [AmbienceType.HeavyRain]: 0.2,
      [AmbienceType.Thunder]: 0.18,
      [AmbienceType.Wind]: 0.5,
    },
  },
  {
    label: "Tavern 1",
    volumes: {
      [AmbienceType.Crowd]: 0.25,
      [AmbienceType.CrowdedBar]: 0.2,
      [AmbienceType.Restaurant]: 0.2,
      [AmbienceType.Campfire]: 0.18,
    },
  },
  {
    label: "Tavern 2",
    volumes: {
      [AmbienceType.TavernAmbience]: 0.5,
      [AmbienceType.Crowd]: 0.5,
      [AmbienceType.Restaurant]: 0.2,
    },
  },
  {
    label: "Castle",
    volumes: {
      [AmbienceType.CastleNight]: 0.3,
      [AmbienceType.Wind]: 0.2,
      [AmbienceType.HowlingWind]: 0.2,
      [AmbienceType.Owl]: 0.2,
    },
  },
  {
    label: "King's Room",
    volumes: {
      [AmbienceType.Fireplace]: 1,
      [AmbienceType.Wind]: 0.05,
      [AmbienceType.RainOnWindow]: 0.05,
      [AmbienceType.Clock]: 0.1,
      [AmbienceType.CastleNight]: 0.03,
    },
  },
  {
    label: "Manor",
    volumes: {
      [AmbienceType.Fireplace]: 1,
      [AmbienceType.HowlingWind]: 0.03,
      [AmbienceType.Clock]: 0.15,
      [AmbienceType.RainOnCarRoof]: 0.05,
    },
  },
  {
    label: "Library",
    volumes: {
      [AmbienceType.Library]: 1,
      [AmbienceType.Paper]: 0.05,
      [AmbienceType.Clock]: 0.15,
    },
  },
  {
    label: "Alchemist's Tower",
    volumes: {
      [AmbienceType.Library]: 1,
      [AmbienceType.Paper]: 0.05,
      [AmbienceType.Clock]: 0.15,
      [AmbienceType.BoilingWater]: 0.1,
      [AmbienceType.Bubbles]: 0.03,
    },
  },
  {
    label: "Temple",
    volumes: {
      [AmbienceType.Temple]: 0.25,
      [AmbienceType.SingingBowl]: 0.1,
      [AmbienceType.Campfire]: 0.1,
    },
  },
  {
    label: "Church",
    volumes: {
      [AmbienceType.Church]: 0.25,
      [AmbienceType.VillageBell]: 0.1,
    },
  },
  {
    label: "Village 1",
    volumes: {
      [AmbienceType.MedievalVillage]: 0.5,
    },
  },
  {
    label: "Village 2",
    volumes: {
      [AmbienceType.Birds]: 0.05,
      [AmbienceType.WindInTrees]: 0.05,
      [AmbienceType.Cows]: 0.05,
      [AmbienceType.DogBarking]: 0.03,
      [AmbienceType.Crowd]: 0.25,
      [AmbienceType.VillageBell]: 0.1,
    },
  },
  {
    label: "Village Night",
    volumes: {
      [AmbienceType.NightVillage]: 0.25,
    },
  },
];

export const soundPresetGroups: SoundPresetGroup[] = [
  {
    label: "Forest",
    presets: soundPresets.filter((preset) =>
      ["Forest", "Forest Night"].includes(preset.label),
    ),
  },
  {
    label: "River",
    presets: soundPresets.filter((preset) =>
      ["River", "River Night"].includes(preset.label),
    ),
  },
  {
    label: "Rain",
    presets: soundPresets.filter((preset) =>
      ["Light rain", "Heavy rain"].includes(preset.label),
    ),
  },
  {
    label: "Tavern",
    presets: soundPresets.filter((preset) =>
      ["Tavern 1", "Tavern 2"].includes(preset.label),
    ),
  },
  {
    label: "Indoor",
    presets: soundPresets.filter((preset) =>
      [
        "Castle",
        "King's Room",
        "Manor",
        "Library",
        "Alchemist's Tower",
      ].includes(preset.label),
    ),
  },
  {
    label: "Sacred",
    presets: soundPresets.filter((preset) =>
      ["Temple", "Church"].includes(preset.label),
    ),
  },
  {
    label: "Village",
    presets: soundPresets.filter((preset) =>
      ["Village 1", "Village 2", "Village Night"].includes(preset.label),
    ),
  },
];
