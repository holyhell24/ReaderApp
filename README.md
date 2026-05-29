# ReaderApp

ReaderApp is a local-first EPUB reader built with React, TypeScript, Vite, Tailwind CSS, and `react-reader`.

It is a fully vibecoded project

## Features

- Add EPUB books from the local file system.
- Browse saved books in the library.
- Continue reading from the last saved position after refresh.
- Read in multiple modes:
  - Pages view
  - Chapter view
  - Scrolling view
- Switch between reader themes:
  - Light
  - Dark
  - Gray
  - Sepia
- Customize reading settings:
  - Font family
  - Font size
  - Letter interval
  - Line height
- Open chapter navigation from the reader header.
- Use an ambient sound mixer with presets, custom volumes, mute, start/stop, and master volume.
- Automatically apply ambient scenes for chapters using JSON files from `public/soundScenes`.
- Persist reader theme and reading settings in local storage.