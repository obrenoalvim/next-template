# next-template

Base template for future projects: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Postgres + Drizzle, Better Auth (email/password login), dark mode, toasts, validated env vars, Vitest, ESLint + Prettier, Husky pre-commit hooks, and Docker — all pre-wired.

## Stack

- [Next.js](https://nextjs.org) 16 — App Router, Turbopack
- [TypeScript](https://www.typescriptlang.org) — strict mode
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — copy-in components (`npx shadcn@latest add <component>`)
- [Postgres](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com) — email/password login, session cookies, `/dashboard` as a protected-route example
- [next-themes](https://github.com/pacocoursey/next-themes) — light/dark toggle in the header
- [Sonner](https://sonner.emilkowal.ski) — toast notifications for auth feedback
- [Zod](https://zod.dev) — validates required env vars at startup (`src/lib/env.ts`), fails fast with a clear message instead of an obscure Postgres/auth error
- [React Hook Form](https://react-hook-form.com) + Zod — schema-validated login/register forms (`src/lib/validations/auth.ts`)
- `/api/health` — checks the database connection, used by `docker-compose.yml`'s app healthcheck
- Custom `not-found.tsx` / `error.tsx`
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit/component tests
- [Playwright](https://playwright.dev) — E2E: sign-up/sign-in/update-profile/delete-account (`e2e/auth.spec.ts`)
- ESLint + Prettier (with `prettier-plugin-tailwindcss`)
- Husky + lint-staged — lint/format on commit
- Docker + docker-compose — app and Postgres both containerized
- SEO: `robots.ts`, `sitemap.ts`, OG/Twitter meta, JSON-LD, canonical URLs, and `public/llms.txt`

## Getting started (Docker — recommended)

```bash
cp .env.example .env
# generate a real secret and drop it into .env as BETTER_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

docker compose up -d db          # start Postgres only
npm run db:migrate               # apply schema (first time / after schema changes)
docker compose up -d --build     # build and start the app too
```

App: [http://localhost:3000](http://localhost:3000). Postgres is exposed on host port `5455` by default (not `5432`, to avoid clashing with a local Postgres install — change `POSTGRES_PORT` in `.env` if needed).

`npm run docker:up` / `npm run docker:down` are shortcuts for `docker compose up --build` / `docker compose down`.

## Getting started (without Docker)

Requires a Postgres instance reachable at `DATABASE_URL`.

```bash
cp .env.example .env   # point DATABASE_URL at your own Postgres
npm install
npm run db:migrate
npm run dev
```

## Auth

Better Auth is wired with an email/password provider (`src/lib/auth.ts` server-side, `src/lib/auth-client.ts` client-side). Routes:

- `/login`, `/register` — sign in / sign up forms
- `/dashboard` — example protected page, redirects to `/login` if there's no session
- `/account` — protected page: update name, change password, delete account
- `/api/auth/[...all]` — Better Auth's route handler
- Rate limited: 5 sign-in/sign-up attempts per 60s per IP (see `rateLimit` in `src/lib/auth.ts`)
- `/routes` lists every page and API route in the template

## Database

Schema lives in `src/db/schema.ts` (Drizzle). After changing it:

```bash
npm run db:generate   # generate a SQL migration from the schema
npm run db:migrate    # apply migrations
npm run db:studio     # browse data in Drizzle Studio
```

## Scripts

| Script                 | Purpose                             |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start dev server                    |
| `npm run build`        | Production build                    |
| `npm start`            | Start production server             |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format with Prettier                |
| `npm run format:check` | Check formatting                    |
| `npm test`             | Run tests once                      |
| `npm run test:watch`   | Run tests in watch mode             |
| `npm run test:e2e`     | Run Playwright E2E tests            |
| `npm run db:generate`  | Generate a migration from schema.ts |
| `npm run db:migrate`   | Apply migrations                    |
| `npm run db:studio`    | Open Drizzle Studio                 |
| `npm run docker:up`    | `docker compose up --build`         |
| `npm run docker:down`  | `docker compose down`               |

## Using this as a template

1. Click "Use this template" on GitHub (or `npx degit obrenoalvim/next-template my-app`)
2. Update `package.json` name and this README
3. `cp .env.example .env`, set a real `BETTER_AUTH_SECRET`
4. `docker compose up -d db && npm run db:migrate && npm run dev`

## SEO

`src/app/layout.tsx` sets `metadataBase`, OpenGraph/Twitter tags, and a JSON-LD block, all derived from `NEXT_PUBLIC_SITE_URL` (defaults to `http://localhost:3000`, set it to your real domain in production). `src/app/robots.ts` and `src/app/sitemap.ts` are Next.js metadata routes — add new public pages to the `routes` array in `sitemap.ts`. `public/llms.txt` gives AI agents/IDE tools a short, structured summary of the project.

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component>
```

Components are copied into `src/components/ui` — edit them freely, they're yours.
