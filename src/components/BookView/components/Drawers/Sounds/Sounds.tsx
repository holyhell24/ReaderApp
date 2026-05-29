import { useEffect, useMemo, useRef, useState } from "react";
import { AmbienceType } from "../../../../../enums";
import {
  soundCategories,
  soundTracks,
  type SoundCategory,
  type SoundTrack,
} from "../../../../../sounds";
import type { SoundsDrawerProps } from "../types";
import { soundPresetGroups } from "./soundPresets";
import type { SoundPreset } from "./types";

const CUSTOM_PRESET_LABEL = "Custom";
const DEFAULT_MASTER_VOLUME_LEVEL = 1;

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function categoryLabel(category: SoundCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function presetButtonStyles(
  isActive: boolean,
  themeColors: SoundsDrawerProps["themeColors"],
) {
  return {
    backgroundColor: isActive ? themeColors.foreground : "transparent",
    borderColor: isActive ? themeColors.foreground : themeColors.muted,
    color: isActive ? themeColors.background : themeColors.foreground,
  };
}

export default function Sounds({ themeColors }: SoundsDrawerProps) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [activePreset, setActivePreset] = useState(CUSTOM_PRESET_LABEL);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [masterVolume, setMasterVolume] = useState(DEFAULT_MASTER_VOLUME_LEVEL);
  const [trackVolumes, setTrackVolumes] = useState<
    Partial<Record<AmbienceType, number>>
  >({});

  const tracksByCategory = useMemo(
    () =>
      soundCategories.reduce<Record<SoundCategory, SoundTrack[]>>(
        (groups, category) => {
          groups[category] = soundTracks.filter(
            (track) => track.category === category,
          );
          return groups;
        },
        {} as Record<SoundCategory, SoundTrack[]>,
      ),
    [],
  );

  useEffect(() => {
    soundTracks.forEach((track) => {
      const audio = audioRefs.current[track.id];
      if (!audio) return;

      audio.volume = (trackVolumes[track.id] ?? 0) * masterVolume;
      audio.muted = isMuted;
    });
  }, [isMuted, masterVolume, trackVolumes]);

  const playTrack = (trackId: AmbienceType, volume: number) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;

    audio.volume = volume * masterVolume;
    audio.muted = isMuted;

    if (volume <= 0) {
      audio.pause();
      return;
    }

    setIsRunning(true);
    void audio.play();
  };

  const handleTrackVolumeChange = (trackId: AmbienceType, volume: number) => {
    setActivePreset(CUSTOM_PRESET_LABEL);
    setTrackVolumes((volumes) => ({
      ...volumes,
      [trackId]: volume,
    }));
    playTrack(trackId, volume);
  };

  const applyPreset = (preset: SoundPreset) => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio?.pause();
    });

    setActivePreset(preset.label);
    setTrackVolumes(preset.volumes);
    setIsRunning(false);

    Object.entries(preset.volumes).forEach(([trackId, volume]) => {
      playTrack(trackId as AmbienceType, volume);
    });
  };

  const startAmbient = () => {
    let hasActiveTrack = false;

    soundTracks.forEach((track) => {
      const volume = trackVolumes[track.id] ?? 0;
      if (volume <= 0) return;

      hasActiveTrack = true;
      playTrack(track.id, volume);
    });

    setIsRunning(hasActiveTrack);
  };

  const stopAmbient = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio?.pause();
    });
    setIsRunning(false);
  };

  const toggleAmbient = () => {
    if (isRunning) {
      stopAmbient();
      return;
    }

    startAmbient();
  };

  return (
    <div className="relative flex max-w-full items-center gap-2">
      {soundTracks.map((track) => (
        <audio
          key={track.id}
          ref={(audio) => {
            audioRefs.current[track.id] = audio;
          }}
          src={track.src}
          loop
          preload="none"
        />
      ))}

      <button
        type="button"
        aria-expanded={isDropdownOpen}
        aria-controls="book-sounds-menu"
        onClick={() => setIsDropdownOpen((isOpen) => !isOpen)}
        className="cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        Change ambient
      </button>
      <button
        type="button"
        onClick={toggleAmbient}
        className="cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        {isRunning ? "Stop" : "Start"}
      </button>
      <button
        type="button"
        onClick={() => setIsMuted((muted) => !muted)}
        className="cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <label className="flex min-w-32 items-center gap-2 text-xs">
        <span style={{ color: themeColors.muted }}>Master</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={masterVolume}
          aria-label="Master ambient volume"
          onChange={(event) => setMasterVolume(Number(event.target.value))}
          className="w-28 cursor-pointer"
        />
        <span className="w-8" style={{ color: themeColors.muted }}>
          {formatPercent(masterVolume)}
        </span>
      </label>

      {isDropdownOpen && (
        <div
          id="book-sounds-menu"
          className="absolute left-1/2 top-full z-40 mt-3 max-h-[70vh] w-[36rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-y-auto border p-4 shadow-xl"
          style={{
            backgroundColor: themeColors.background,
            borderColor: themeColors.muted,
            color: themeColors.foreground,
          }}
        >
          <section
            className="mb-5 border-b pb-4"
            style={{ borderColor: themeColors.muted }}
          >
            <h3 className="mb-3 text-sm font-semibold">Presets</h3>
            <div className="grid gap-3">
              {soundPresetGroups.map((group) => (
                <div
                  key={group.label}
                  className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3"
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: themeColors.muted }}
                  >
                    {group.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.presets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                        style={presetButtonStyles(
                          activePreset === preset.label,
                          themeColors,
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setActivePreset(CUSTOM_PRESET_LABEL)}
                className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                style={presetButtonStyles(
                  activePreset === CUSTOM_PRESET_LABEL,
                  themeColors,
                )}
              >
                {CUSTOM_PRESET_LABEL}
              </button>
            </div>
          </section>

          {activePreset === CUSTOM_PRESET_LABEL &&
            soundCategories.map((category) => {
              const tracks = tracksByCategory[category];

              return (
                <section key={category} className="mb-5 last:mb-0">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold">
                      {categoryLabel(category)}
                    </h3>
                    <span
                      className="text-xs"
                      style={{ color: themeColors.muted }}
                    >
                      {tracks.length} sounds
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {tracks.map((track) => {
                      const volume = trackVolumes[track.id] ?? 0;

                      return (
                        <label
                          key={track.id}
                          className="grid cursor-pointer gap-1 text-xs"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="truncate font-medium">
                              {track.label}
                            </span>
                            <span
                              className="shrink-0"
                              style={{ color: themeColors.muted }}
                            >
                              {formatPercent(volume)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            aria-label={`${track.label} volume`}
                            onChange={(event) =>
                              handleTrackVolumeChange(
                                track.id,
                                Number(event.target.value),
                              )
                            }
                            className="w-full cursor-pointer"
                          />
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}
        </div>
      )}
    </div>
  );
}
