import type { ComponentProps } from "react";
import type { Location } from "epubjs/types/rendition";
import { ReactReader } from "react-reader";
import type { ReaderSettings, ReaderTheme } from "../../../../theme";
import type { ReaderTocItem } from "../../types";

export interface EpubReaderProps {
  isChromeVisible: boolean;
  location: string | number;
  onCurrentHrefChange: (href: string) => void;
  onLocationChange: (location: string) => void;
  onReaderClick: () => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  settings: ReaderSettings;
  theme: ReaderTheme;
  url: string | ArrayBuffer;
}

export type ReaderRendition = Parameters<
  NonNullable<ComponentProps<typeof ReactReader>["getRendition"]>
>[0];

export type ReaderEpubOptions = ComponentProps<typeof ReactReader>["epubOptions"];

export type ReaderLocationPayload =
  | Location
  | {
      href?: string;
      start?: {
        href?: string;
      };
    }
  | null
  | undefined;
