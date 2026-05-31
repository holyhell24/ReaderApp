import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AmbienceType, SoundCategory } from "../../../../../enums";
import { soundTracks } from "../../../../../sounds";
import type { SoundTrack } from "../../../../../types/types";
import type { SoundsDrawerProps } from "../types";
import { soundPresetGroups, soundPresets } from "./soundPresets";
import { soundCategories, type SoundPreset } from "./types";

const CUSTOM_PRESET_LABEL = "Custom";
const DEFAULT_MASTER_VOLUME_LEVEL = 1;
const SOUND_SETTINGS_STORAGE_KEY = "reader-app-sound-settings";

interface SoundSettings {
  isMuted: boolean;
  isRunning: boolean;
  volume: number;
}

interface ApplyPresetOptions {
  play?: boolean;
}

function clampVolume(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

function loadSoundSettings(): SoundSettings {
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

function saveSoundSettings(settings: SoundSettings): void {
  localStorage.setItem(SOUND_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

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

export default function Sounds({
  sceneSoundPreset,
  sceneSoundPresetKey,
  themeColors,
}: SoundsDrawerProps) {
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const appliedSceneSoundPresetKeyRef = useRef<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const soundSettings = useMemo(() => loadSoundSettings(), []);
  const [activePreset, setActivePreset] = useState(CUSTOM_PRESET_LABEL);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAutoAmbientEnabled, setIsAutoAmbientEnabled] = useState(
    soundSettings.isRunning,
  );
  const [isMuted, setIsMuted] = useState(soundSettings.isMuted);
  const [isRunning, setIsRunning] = useState(false);
  const [volume, setVolume] = useState(soundSettings.volume);
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
  const presetByLabel = useMemo(
    () => new Map(soundPresets.map((preset) => [preset.label, preset])),
    [],
  );

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    soundTracks.forEach((track) => {
      const audio = audioRefs.current[track.id];
      if (!audio) return;

      audio.volume = (trackVolumes[track.id] ?? 0) * volume;
      audio.muted = isMuted;
    });
  }, [isMuted, trackVolumes, volume]);

  useEffect(() => {
    saveSoundSettings({
      isMuted,
      isRunning: isAutoAmbientEnabled,
      volume,
    });
  }, [isAutoAmbientEnabled, isMuted, volume]);

  const playTrack = useCallback((trackId: AmbienceType, trackVolume: number) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;

    audio.volume = trackVolume * volume;
    audio.muted = isMuted;

    if (trackVolume <= 0) {
      audio.pause();
      return;
    }

    setIsRunning(true);
    void audio.play();
  }, [isMuted, volume]);

  const handleTrackVolumeChange = (trackId: AmbienceType, trackVolume: number) => {
    setActivePreset(CUSTOM_PRESET_LABEL);
    setTrackVolumes((volumes) => ({
      ...volumes,
      [trackId]: trackVolume,
    }));
    playTrack(trackId, trackVolume);
  };

  const applyPreset = useCallback((preset: SoundPreset, options?: ApplyPresetOptions) => {
    const shouldPlay = options?.play ?? true;

    Object.values(audioRefs.current).forEach((audio) => {
      audio?.pause();
    });

    setActivePreset(preset.label);
    setTrackVolumes(preset.volumes);
    setIsRunning(false);

    if (!shouldPlay) return;

    setIsAutoAmbientEnabled(true);

    Object.entries(preset.volumes).forEach(([trackId, volume]) => {
      playTrack(trackId as AmbienceType, volume);
    });
  }, [playTrack]);

  useEffect(() => {
    if (
      !sceneSoundPreset ||
      !sceneSoundPresetKey ||
      appliedSceneSoundPresetKeyRef.current === sceneSoundPresetKey
    ) {
      return;
    }

    const preset = presetByLabel.get(sceneSoundPreset);
    if (!preset) return;

    const timeoutId = window.setTimeout(() => {
      appliedSceneSoundPresetKeyRef.current = sceneSoundPresetKey;
      applyPreset(preset, { play: isAutoAmbientEnabled });
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    applyPreset,
    isAutoAmbientEnabled,
    presetByLabel,
    sceneSoundPreset,
    sceneSoundPresetKey,
  ]);

  const startAmbient = () => {
    let hasActiveTrack = false;

    soundTracks.forEach((track) => {
      const volume = trackVolumes[track.id] ?? 0;
      if (volume <= 0) return;

      hasActiveTrack = true;
      playTrack(track.id, volume);
    });

    setIsRunning(hasActiveTrack);
    setIsAutoAmbientEnabled(hasActiveTrack);
  };

  const stopAmbient = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio?.pause();
    });
    setIsRunning(false);
    setIsAutoAmbientEnabled(false);
  };

  const handleMuteToggle = () => {
    setIsMuted((muted) => !muted);
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(clampVolume(nextVolume));
    setIsMuted(nextVolume <= 0);
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
        ref={triggerRef}
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
        onClick={handleMuteToggle}
        className="cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          borderColor: themeColors.muted,
          color: themeColors.foreground,
        }}
      >
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <label className="flex min-w-32 items-center gap-2 text-xs">
        <span style={{ color: themeColors.muted }}>Volume</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          aria-label="Ambient volume"
          onChange={(event) => handleVolumeChange(Number(event.target.value))}
          className="w-28 cursor-pointer"
        />
        <span className="w-8" style={{ color: themeColors.muted }}>
          {formatPercent(isMuted ? 0 : volume)}
        </span>
      </label>

      {isDropdownOpen && (
        <>
          <button
            type="button"
            aria-label="Close ambient menu"
            className="fixed inset-0 z-30 cursor-default bg-transparent"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div
            ref={dropdownRef}
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
        </>
      )}
    </div>
  );
}
