# unnamed-js-game

An Electron desktop game powered by Vite, React, and Phaser. The renderer uses React to host a Phaser canvas, while the main process manages the Electron window and preload scripts.

## Prerequisites
- [Node.js](https://nodejs.org/) (pnpm@10.x is recommended; npm also works)
- pnpm (preferred) or npm

## Installation
Install dependencies with your preferred package manager:

```bash
pnpm install
# or
npm install
```

## Development
Start the Electron + Vite development server:

```bash
pnpm dev
# or
npm run dev
```

## Building and Packaging
Type-check and bundle the app for production:

```bash
pnpm build
```

Additional packaging helpers are available:

- `pnpm build:unpack` – build and generate an unpacked Electron app directory.
- `pnpm build:mwl` – build and package for macOS, Windows, and Linux.
- `pnpm build:win` / `pnpm build:mac` / `pnpm build:linux` – platform-specific builds.

Preview a production build with Electron:

```bash
pnpm start
```

## Quality Checks
Run static analysis and type checks:

```bash
pnpm lint           # Biome linting
pnpm lint:fix.      # Biome linting with fix
pnpm typecheck      # TypeScript checks for main and renderer
```

## Environment
Window size and in-game dimensions are driven by Vite environment variables. Create a `.env` file in the project root if you need to override defaults:

```bash
VITE_WIDTH=1920
VITE_HEIGHT=1080
```

These values are consumed in both the Electron main process and Phaser game scenes to size the window and initial player position.