# AGENTS.md

Overview of this codebase for developers and AI agents.

## Project Overview

Village Land Register: a page for recording land parcel details (survey number, extent, owner, and
the person cultivating the land) and browsing previously recorded entries. Built with TanStack Start
and deployed on Netlify, backed by Netlify Database (Postgres) via Drizzle ORM.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Database | Netlify Database (Postgres) via `@netlify/database` + Drizzle ORM |
| Validation | Zod |
| Language | TypeScript 5.9 |
| Deployment | Netlify |

## Directory Structure

```
├── db
│   ├── schema.ts   # Drizzle table definitions (land_records)
│   └── index.ts    # Drizzle client, connects automatically to Netlify Database
├── drizzle.config.ts  # Drizzle Kit config; migrations output to netlify/database/migrations
├── netlify/database/migrations  # Generated SQL migrations, applied automatically on deploy
├── src
│   ├── components
│   │   └── LandRecordsPage.tsx  # Form to add a land record + list of existing records
│   ├── server
│   │   └── land-records.functions.ts  # TanStack Start server functions: getLandRecords, createLandRecord
│   ├── routes
│   │   ├── __root.tsx  # Root HTML shell, head metadata, global styles
│   │   └── index.tsx   # Home route: loads records via getLandRecords, renders LandRecordsPage
│   ├── router.tsx
│   └── styles.css  # Tailwind import + ledger color/font theme variables
├── netlify.toml  # Build command (vite build), publish dir (dist/client), dev server settings
├── package.json
└── vite.config.ts
```

## Data Model

`land_records` table (`db/schema.ts`):

- `surveyNumber` — required, the official survey/plot number
- `village` — optional
- `landExtent` + `extentUnit` — numeric extent and its unit (acres, hectares, guntas, cents, bigha)
- `ownerName`, `cultivatorName` — required; cultivator may differ from the owner (e.g. tenant farming)
- `cropGrown`, `notes` — optional
- `createdAt` — defaults to insert time

Any schema change requires a new migration: `npx drizzle-kit generate --name <description>`.

## Server Functions

`src/server/land-records.functions.ts` exposes two TanStack Start server functions:

- `getLandRecords` (GET) — returns all records, newest first
- `createLandRecord` (POST) — validates input with Zod and inserts a new record

The `index.tsx` route loader calls `getLandRecords` so the list is populated on initial render;
`LandRecordsPage` calls `createLandRecord` on submit and prepends the new record to local state.

## Conventions

- Components: PascalCase; server function modules use `*.functions.ts`
- Zod schemas validate all server function input
- Styling uses Tailwind utility classes plus CSS custom properties defined in `styles.css`
  (`--ledger-*` tokens) for the ledger/register color theme
- TypeScript strict mode

## Development Commands

```bash
npm run dev      # Start dev server (vite dev --port 3000)
npm run build    # Production build
```

Use `netlify dev` instead of `npm run dev` to get local emulation of Netlify Database and other
Netlify platform features.
