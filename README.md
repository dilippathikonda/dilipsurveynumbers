# Village Land Register

A simple page for recording land parcel details — survey number, land extent, the owner, and the
person actually cultivating the land (useful when a tenant farms land on someone else's behalf) —
and browsing every entry that has been logged so far.

## Key technologies

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router) for the app and server functions
- [Netlify Database](https://docs.netlify.com/database/get-started/) (managed Postgres) with [Drizzle ORM](https://orm.drizzle.team/) for storage
- Tailwind CSS 4 for styling
- Zod for input validation

## Running locally

Install dependencies and start the Netlify-aware dev server so the database connects correctly:

```bash
npm install
netlify dev
```

The app will be available at the URL Netlify CLI prints (typically `http://localhost:8888`).

On first run, Netlify provisions the database and applies the migrations in
`netlify/database/migrations/` automatically.

## Making schema changes

Edit `db/schema.ts`, then generate a migration:

```bash
npx drizzle-kit generate --name <description_of_change>
```

Commit the generated SQL file under `netlify/database/migrations/` along with the schema change.
