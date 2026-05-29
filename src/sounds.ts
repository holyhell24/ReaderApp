import { AmbienceType } from "./enums";

export const soundCategories = [
  "nature",
  "rain",
  "animals",
  "urban",
  "places",
  "things",
  "long-ambients",
] as const;

export type SoundCategory = (typeof soundCategories)[number];

export interface SoundTrack {
  category: SoundCategory;
  id: AmbienceType;
  label: string;
  src: string;
}

export const soundTracks: SoundTrack[] = [
  {
    category: "nature",
    id: AmbienceType.Campfire,
    label: "Campfire",
    src: "/sounds/nature/campfire.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.Droplets,
    label: "Droplets",
    src: "/sounds/nature/droplets.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.HowlingWind,
    label: "Howling wind",
    src: "/sounds/nature/howling-wind.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.Jungle,
    label: "Jungle",
    src: "/sounds/nature/jungle.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.River,
    label: "River",
    src: "/sounds/nature/river.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.WalkInSnow,
    label: "Walk in snow",
    src: "/sounds/nature/walk-in-snow.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.WalkOnGravel,
    label: "Walk on gravel",
    src: "/sounds/nature/walk-on-gravel.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.WalkOnLeaves,
    label: "Walk on leaves",
    src: "/sounds/nature/walk-on-leaves.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.Waterfall,
    label: "Waterfall",
    src: "/sounds/nature/waterfall.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.Waves,
    label: "Waves",
    src: "/sounds/nature/waves.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.Wind,
    label: "Wind",
    src: "/sounds/nature/wind.mp3",
  },
  {
    category: "nature",
    id: AmbienceType.WindInTrees,
    label: "Wind in trees",
    src: "/sounds/nature/wind-in-trees.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.HeavyRain,
    label: "Heavy rain",
    src: "/sounds/rain/heavy-rain.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.LightRain,
    label: "Light rain",
    src: "/sounds/rain/light-rain.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.RainOnCarRoof,
    label: "Rain on car roof",
    src: "/sounds/rain/rain-on-car-roof.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.RainOnLeaves,
    label: "Rain on leaves",
    src: "/sounds/rain/rain-on-leaves.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.RainOnTent,
    label: "Rain on tent",
    src: "/sounds/rain/rain-on-tent.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.RainOnWindow,
    label: "Rain on window",
    src: "/sounds/rain/rain-on-window.mp3",
  },
  {
    category: "rain",
    id: AmbienceType.Thunder,
    label: "Thunder",
    src: "/sounds/rain/thunder.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Beehive,
    label: "Beehive",
    src: "/sounds/animals/beehive.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Birds,
    label: "Birds",
    src: "/sounds/animals/birds.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.CatPurring,
    label: "Cat purring",
    src: "/sounds/animals/cat-purring.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Chickens,
    label: "Chickens",
    src: "/sounds/animals/chickens.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Cows,
    label: "Cows",
    src: "/sounds/animals/cows.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Crickets,
    label: "Crickets",
    src: "/sounds/animals/crickets.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Crows,
    label: "Crows",
    src: "/sounds/animals/crows.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.DogBarking,
    label: "Dog barking",
    src: "/sounds/animals/dog-barking.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Frog,
    label: "Frog",
    src: "/sounds/animals/frog.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.HorseGallop,
    label: "Horse gallop",
    src: "/sounds/animals/horse-gallop.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Owl,
    label: "Owl",
    src: "/sounds/animals/owl.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Seagulls,
    label: "Seagulls",
    src: "/sounds/animals/seagulls.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Sheep,
    label: "Sheep",
    src: "/sounds/animals/sheep.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Whale,
    label: "Whale",
    src: "/sounds/animals/whale.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Wolf,
    label: "Wolf",
    src: "/sounds/animals/wolf.mp3",
  },
  {
    category: "animals",
    id: AmbienceType.Woodpecker,
    label: "Woodpecker",
    src: "/sounds/animals/woodpecker.mp3",
  },
  {
    category: "urban",
    id: AmbienceType.Crowd,
    label: "Crowd",
    src: "/sounds/urban/crowd.mp3",
  },
  {
    category: "places",
    id: AmbienceType.Church,
    label: "Church",
    src: "/sounds/places/church.mp3",
  },
  {
    category: "places",
    id: AmbienceType.CrowdedBar,
    label: "Crowded bar",
    src: "/sounds/places/crowded-bar.mp3",
  },
  {
    category: "places",
    id: AmbienceType.Library,
    label: "Library",
    src: "/sounds/places/library.mp3",
  },
  {
    category: "places",
    id: AmbienceType.NightVillage,
    label: "Night village",
    src: "/sounds/places/night-village.mp3",
  },
  {
    category: "places",
    id: AmbienceType.Restaurant,
    label: "Restaurant",
    src: "/sounds/places/restaurant.mp3",
  },
  {
    category: "places",
    id: AmbienceType.Temple,
    label: "Temple",
    src: "/sounds/places/temple.mp3",
  },
  {
    category: "places",
    id: AmbienceType.Underwater,
    label: "Underwater",
    src: "/sounds/places/underwater.mp3",
  },
  {
    category: "things",
    id: AmbienceType.BoilingWater,
    label: "Boiling water",
    src: "/sounds/things/boiling-water.mp3",
  },
  {
    category: "things",
    id: AmbienceType.Bubbles,
    label: "Bubbles",
    src: "/sounds/things/bubbles.mp3",
  },
  {
    category: "things",
    id: AmbienceType.Clock,
    label: "Clock",
    src: "/sounds/things/clock.mp3",
  },
  {
    category: "things",
    id: AmbienceType.Paper,
    label: "Paper",
    src: "/sounds/things/paper.mp3",
  },
  {
    category: "things",
    id: AmbienceType.SingingBowl,
    label: "Singing bowl",
    src: "/sounds/things/singing-bowl.mp3",
  },
  {
    category: "things",
    id: AmbienceType.WindChimes,
    label: "Wind chimes",
    src: "/sounds/things/wind-chimes.mp3",
  },
  {
    category: "long-ambients",
    id: AmbienceType.CastleNight,
    label: "Castle night",
    src: "/sounds/long-ambients/castle-night.mp3",
  },
  {
    category: "long-ambients",
    id: AmbienceType.MedievalVillage,
    label: "Medieval village",
    src: "/sounds/long-ambients/medieval-village.mp3",
  },
  {
    category: "long-ambients",
    id: AmbienceType.TavernAmbience,
    label: "Tavern Ambience",
    src: "/sounds/long-ambients/tavern-ambience.mp3",
  },
  {
    category: "long-ambients",
    id: AmbienceType.VillageBell,
    label: "Village bell",
    src: "/sounds/long-ambients/village-bell.mp3",
  },
  {
    category: "long-ambients",
    id: AmbienceType.Fireplace,
    label: "Fireplace",
    src: "/sounds/long-ambients/fireplace.mp3",
  },
];
