import type { BookMetadata } from "../types/types";

export interface StoredBook extends BookMetadata {
  id: string;
  fileName: string;
  data: ArrayBuffer;
}

export interface LibraryMeta {
  activeBookId: string | null;
}
