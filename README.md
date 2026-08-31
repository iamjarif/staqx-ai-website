# StaqX.ai Website

The official marketing website for **StaqX.ai** — a specialized semiconductor design partner delivering end-to-end IC engineering services from architecture to silicon.

**Live site:** [staqx.ai](https://staqx.ai)  
**Repository:** [github.com/iamjarif/staqx-ai-website](https://github.com/iamjarif/staqx-ai-website)

---

## About StaqX.ai

StaqX.ai provides silicon-proven VLSI solutions across advanced process nodes for clients in power electronics, telecommunications, automotive, and IoT. The company covers the full IC engineering lifecycle — from device physics and TCAD simulation through physical design, AMS verification, and signoff.

### What this site includes

| Page / section | Description |
| --- | --- |
| **Homepage** | Hero, mission statement, expertise carousel, work process, engagement models, security, blog preview, and contact form |
| **Blog index** (`/blogs`) | Paginated list of engineering articles and company updates |
| **Blog posts** (`/blogs/[slug]`) | Individual articles with Portable Text rendering, reading time, and related posts |
| **SEO** | Open Graph metadata, JSON-LD structured data, sitemap, and robots.txt |

### Services highlighted on the site

- 3D-IC Design
- Silicon Photonics
- RF & Analog
- TCAD Simulation
- Quantum Computing
- Physical Design (RTL-to-GDSII)
- AMS Verification

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| Animation | [Motion](https://motion.dev/), [Lenis](https://lenis.darkroom.engineering/) (smooth scroll) |
| CMS | [Sanity](https://www.sanity.io/) via `next-sanity` |
| Icons | Phosphor Icons |
| Styling utilities | `clsx`, `tailwind-merge`, `class-variance-authority` |

---

## Getting Started

### Prerequisites

- **Node.js** 20 or later
- **npm** (ships with Node)

### 1. Clone and install

```bash
git clone https://github.com/iamjarif/staqx-ai-website.git
cd staqx-ai-website
npm install
```

### 2. Configure environment

Copy the example env file and fill in the values:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below for details. The site runs without Sanity credentials, but blog pages will show empty states until CMS values are set.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server supports hot reload for both pages and components.

### 4. Production build

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL used in metadata, sitemap, and Open Graph tags (e.g. `https://staqx.ai`) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | For blog | Sanity project ID — shared with the Boston Semiconductor CMS |
| `NEXT_PUBLIC_SANITY_DATASET` | No | Sanity dataset name (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | Sanity API version (default: `2024-01-01`) |
| `SANITY_API_READ_TOKEN` | No | Read token — only needed if the Sanity dataset is private |
| `RESEND_API_KEY` | For contact form | Resend API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | For contact form | Verified sender address (e.g. `StaqX.ai <hello@staqx.ai>`). Use `onboarding@resend.dev` for testing |
| `RESEND_CONTACT_TO_EMAIL` | For contact form | Inbox that receives contact form submissions (e.g. `info@staqx.ai`) |

Never commit `.env.local` or any file containing secrets. `.env.example` is the reference for all supported variables.

---

## Project Structure

```
staqx-ai-website/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, Lenis, JSON-LD)
│   ├── page.tsx                  # Homepage
│   ├── blogs/                    # Blog index and dynamic post routes
│   ├── robots.ts                 # robots.txt generation
│   ├── sitemap.ts                # Dynamic sitemap (includes blog posts)
│   └── globals.css               # Global styles and Tailwind imports
│
├── components/
│   ├── blog/                     # BlogCard, BlogPostArticle, PortableText renderer
│   ├── layout/                   # Header, Footer
│   ├── providers/                # LenisProvider (smooth scroll)
│   ├── sections/                 # Homepage sections (Hero, Expertise, Contact, etc.)
│   ├── seo/                      # JSON-LD helper
│   └── ui/                       # Primitives — Button, Container, Section, Logo, etc.
│
├── config/
│   ├── site.ts                   # Site name, description, navigation, social links
│   └── design-tokens.ts          # Colors, spacing, typography (synced from Figma)
│
├── lib/
│   ├── blog.ts                   # Sanity blog fetch helpers
│   ├── homepage-data.ts          # Static homepage copy and service definitions
│   ├── metadata.ts               # Shared metadata factory
│   ├── schema.ts                 # JSON-LD schema builders
│   ├── sanity/                   # Sanity client and GROQ queries
│   └── fonts.ts                  # DM Sans font configuration
│
├── public/
│   ├── icons/homepage/           # SVG icons and service illustrations
│   └── images/homepage/          # Hero, backgrounds, blog placeholder
│
├── styles/
│   ├── tokens.css                # CSS custom properties from design tokens
│   └── typography.css            # Type scale utility classes
│
└── types/                        # Shared TypeScript interfaces
```

---

## Architecture & Conventions

### Server Components first

Pages and sections are **React Server Components** by default. Client components (`"use client"`) are used only where browser APIs or interactivity are required — carousels, accordions, smooth scroll, and form handling.

### Content sources

| Content type | Location | Notes |
| --- | --- | --- |
| Homepage copy & services | `lib/homepage-data.ts` | Edit text and service cards here |
| Site metadata & nav | `config/site.ts` | Name, description, navigation links, social URLs |
| Blog posts | Sanity CMS | Fetched at build/request time with 60s revalidation |
| Design tokens | `config/design-tokens.ts` + `styles/tokens.css` | Synced from Figma |

### Styling

- **Tailwind CSS 4** with semantic token classes (`bg-surface-page`, `text-text-primary`, etc.)
- **`cn()` utility** (`lib/utils.ts`) for conditional class merging
- **Design tokens** live in `config/design-tokens.ts` and are exposed as CSS variables in `styles/tokens.css`
- **Typography** scale is defined in `styles/typography.css`

### SEO

- `lib/metadata.ts` provides a `createMetadata()` factory used across all pages
- `lib/schema.ts` builds Organization, WebSite, BlogPosting, and BreadcrumbList JSON-LD
- `app/sitemap.ts` dynamically includes all published blog slugs
- Images are served as AVIF/WebP with long-lived cache headers for static assets

### Blog (Sanity CMS)

Blog content is fetched from a shared Sanity project. Queries live in `lib/sanity/queries.ts`. Posts are normalized in `lib/blog.ts` with reading-time estimation and cover image handling. If Sanity is not configured, blog routes gracefully render empty states rather than crashing.

To connect the CMS locally, set `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`. Blog pages revalidate every 60 seconds in production.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing changes |

---

## Deployment

The site is designed for deployment on [Vercel](https://vercel.com/) or any Node.js hosting that supports Next.js App Router.

1. Connect the GitHub repository to your hosting provider
2. Set the environment variables listed above in the project settings
3. Deploy — Next.js will handle static generation, ISR, and server rendering automatically

Ensure `NEXT_PUBLIC_SITE_URL` matches your production domain so metadata, sitemap URLs, and canonical links are correct.

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes and run `npm run lint`, `npm run typecheck`, and `npm run format:check`
3. Open a pull request with a clear description of what changed and why

For homepage content updates, prefer editing `lib/homepage-data.ts` and `config/site.ts` rather than hardcoding copy inside components. For visual changes, update design tokens in `config/design-tokens.ts` and `styles/tokens.css` to stay aligned with the Figma source of truth.

---

## License

Private — © StaqX.ai. All rights reserved.
