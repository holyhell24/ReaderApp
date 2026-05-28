export interface EpubReaderProps {
  location: string | number;
  onLocationChange: (location: string) => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  url: string | ArrayBuffer;
}

export interface ReaderTocItem {
  href: string;
  label: string;
  subitems?: ReaderTocItem[];
}
