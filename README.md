# Project

Production-ready foundation for a Next.js website. UI and content will be implemented from a Figma design in a later step.

## Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Motion** (animation foundation)
- **Lucide React** (icons)
- **Zod** (validation)
- **class-variance-authority**, **clsx**, **tailwind-merge** (styling utilities)

## Getting Started

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |

## Production Build

```bash
npm run build
npm run start
```

## Project Structure

```
app/                  Next.js App Router pages and layouts
components/
  ui/                 UI primitives (Button, Container, etc.)
  layout/             Header, Footer, Navigation (future)
  sections/           Page sections from Figma (future)
  shared/             Shared non-primitive components (future)
config/               Site configuration
hooks/                Custom React hooks (future)
lib/                  Utilities and helpers
public/
  images/             Static images
  icons/              Static icons
  fonts/              Local font files (if needed)
types/                Shared TypeScript types
```

## Code Architecture

- **Server Components by default** — use `"use client"` only when client-side behavior is required.
- **Small client boundaries** — keep interactive components focused and isolated.
- **Design-agnostic foundation** — visual tokens, typography, and sections will be added from Figma.
- **Centralized config** — site metadata and navigation live in `config/site.ts`.
- **Styling** — Tailwind CSS with a `cn()` utility for conditional classes.

## Environment Variables

See `.env.example` for documented variables. Set values in `.env.local` for local development. Never commit secrets.
