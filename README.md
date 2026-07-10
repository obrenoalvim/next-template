English | [Português](README.pt.md)

# next-template

Production-ready base template for new projects: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Postgres + Drizzle, Better Auth (email/password, email verification, password reset, rate limiting), i18n, dark mode, structured logging, and Docker — all pre-wired and tested end to end. Clone it, run one command, start building your first feature instead of your fifth auth integration.

## Contents

- [Stack](#stack)
- [Project structure](#project-structure)
- [Getting started (Docker)](#getting-started-docker--recommended)
- [Getting started (without Docker)](#getting-started-without-docker)
- [Environment variables](#environment-variables)
- [Auth](#auth)
- [Email](#email)
- [i18n](#i18n)
- [Database](#database)
- [Requests and logging](#requests-and-logging)
- [Example CRUD resource](#example-crud-resource)
- [SEO](#seo)
- [Testing](#testing)
- [CI/CD](#cicd)
- [Docker](#docker-1)
- [Scripts](#scripts)
- [Using this as a template](#using-this-as-a-template)
- [Adding shadcn/ui components](#adding-shadcnui-components)
- [Design notes and gotchas](#design-notes-and-gotchas)

## Stack

- [Next.js](https://nextjs.org) 16 — App Router, Turbopack
- [TypeScript](https://www.typescriptlang.org) — strict mode
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — copy-in components (`npx shadcn@latest add <component>`)
- [Postgres](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com) — email/password login, session cookies, email verification, password reset, rate limiting
- [next-intl](https://next-intl.dev) — i18n: `en` (default, unprefixed) + `pt`, locale switcher in the header
- Email (verification + password reset) via Gmail SMTP app passwords, with a console fallback in dev
- [next-themes](https://github.com/pacocoursey/next-themes) — light/dark toggle in the header
- [Sonner](https://sonner.emilkowal.ski) — toast notifications for auth feedback
- [Zod](https://zod.dev) — validates required env vars at startup, fails fast with a clear message; also backs every form schema
- [React Hook Form](https://react-hook-form.com) + Zod — schema-validated forms across login/register/account/notes
- [Pino](https://getpino.io) — structured server-side logging, pretty in dev, JSON in prod
- `src/lib/api-client.ts` — typed fetch wrapper for the app's own `/api/*` routes, one `ApiError` shape instead of scattered try/catch
- [TanStack Query](https://tanstack.com/query) — cache/loading/retry for client-side data fetching
- [TanStack Table](https://tanstack.com/table) — sortable table, used in the notes example
- `/api/health` — checks the database connection, used by the Docker healthcheck
- Custom `not-found.tsx` / `error.tsx`
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit/component tests
- [Playwright](https://playwright.dev) — E2E: auth flow, notes CRUD, locale switching
- ESLint + Prettier (with `prettier-plugin-tailwindcss`)
- Husky + lint-staged — lint/format on commit
- Docker + docker-compose — app and Postgres both containerized
- GitHub Actions CI — build+lint+test, Docker image build, and a full E2E run against a real Postgres service container
- SEO: `robots.ts`, `sitemap.ts`, OG/Twitter meta, dynamic OG image, JSON-LD, canonical URLs, `public/llms.txt`

## Project structure

```
src/
  app/
    [locale]/            # every page lives here — layout.tsx is the de facto root layout
      layout.tsx          # html/body, providers (theme, query, i18n), header/footer
      page.tsx             # home
      login/, register/, forgot-password/, reset-password/
      dashboard/, account/, notes/     # protected (see proxy.ts)
      routes/               # lists every page + API route
      not-found.tsx, error.tsx
    api/
      auth/[...all]/route.ts   # Better Auth's handler
      health/route.ts
      notes/route.ts, notes/[id]/route.ts
    robots.ts, sitemap.ts, opengraph-image.tsx   # unlocalized, root-level
    globals.css
  components/
    header.tsx, footer.tsx, theme-toggle.tsx, theme-provider.tsx
    locale-switcher.tsx, query-provider.tsx
    account-forms.tsx, notes-view.tsx, health-status.tsx
    ui/                    # shadcn components — yours to edit
  db/
    index.ts               # drizzle client
    schema.ts               # user/session/account/verification (Better Auth) + note (example)
  i18n/
    routing.ts, navigation.ts, request.ts
  lib/
    auth.ts, auth-client.ts    # Better Auth server/client config
    email.ts, email-templates.ts
    env.ts                  # zod-validated env vars
    logger.ts                # pino
    api-client.ts
    utils.ts
    validations/            # zod schema factories (translatable)
  proxy.ts                  # route protection + i18n middleware (Next.js 16's middleware.ts)
messages/
  en.json, pt.json           # next-intl translations
e2e/
  auth.spec.ts, notes.spec.ts, i18n.spec.ts
drizzle/                    # generated SQL migrations — commit these
```

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

## Environment variables

See `.env.example` for the full, commented list. Summary:

| Variable                            | Required    | Purpose                                                              |
| ----------------------------------- | ----------- | -------------------------------------------------------------------- |
| `DATABASE_URL`                      | yes         | Postgres connection string                                           |
| `BETTER_AUTH_SECRET`                | yes         | ≥32 chars; session/token signing                                     |
| `BETTER_AUTH_URL`                   | yes         | Server-side base URL for Better Auth                                 |
| `NEXT_PUBLIC_BETTER_AUTH_URL`       | yes         | Client-side base URL for the auth client                             |
| `POSTGRES_USER/PASSWORD/DB/PORT`    | Docker only | `docker-compose.yml` defaults                                        |
| `NEXT_PUBLIC_SITE_URL`              | no          | metadataBase, canonical URLs, robots/sitemap; defaults to localhost  |
| `LOG_LEVEL`                         | no          | pino level: debug/info/warn/error; default `info`                    |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | no          | Sends real email; without them, emails are logged to console instead |

`src/lib/env.ts` validates the required ones with Zod at startup (server + Docker build) — a missing/invalid var fails fast with a readable message instead of a cryptic downstream error.

## Auth

Better Auth is wired with an email/password provider (`src/lib/auth.ts` server-side, `src/lib/auth-client.ts` client-side). Routes:

- `/login`, `/register` — sign in / sign up forms
- `/forgot-password`, `/reset-password` — email-based password reset (see [Email](#email))
- `/dashboard` — example protected page, redirects to `/login` if there's no session
- `/account` — protected page: update name, change password, delete account
- `/api/auth/[...all]` — Better Auth's route handler
- Rate limited: 5 sign-in/sign-up attempts per 60s per IP (see `rateLimit` in `src/lib/auth.ts`)
- `/routes` lists every page and API route in the template
- `src/proxy.ts` (Next.js 16's replacement for `middleware.ts`) centrally protects `/dashboard`, `/account`, `/notes` — add a path to `protectedPaths` and it's covered, no per-page redirect needed. It's an optimistic cookie check for UX; pages still call `auth.api.getSession()` server-side as the real gate. It also runs next-intl's locale middleware in the same pass.

## Email

Verification emails (sent on sign-up) and password-reset emails go through Gmail SMTP via `src/lib/email.ts` + `src/lib/email-templates.ts`. Without `GMAIL_USER`/`GMAIL_APP_PASSWORD` set, emails are logged to the console (`docker compose logs app`) instead of sent — no setup required to try the flow locally. To send real emails: enable 2FA on a Gmail account, generate an [App Password](https://myaccount.google.com/apppasswords), and set both env vars. Swap `src/lib/email.ts`'s transporter for a real provider (Resend, SES, Postmark) when you outgrow Gmail's sending limits.

## i18n

Locales live in `messages/en.json` and `messages/pt.json`; routing config is in `src/i18n/routing.ts` (add a locale to the `locales` array and drop in a matching `messages/<code>.json`). `en` is the default and unprefixed (`/login`), other locales are prefixed (`/pt/login`) — see `localePrefix: "as-needed"` in `src/i18n/routing.ts`. Server components use `getTranslations`/`setRequestLocale` from `next-intl/server`; client components use `useTranslations`. Always import `Link`/`redirect`/`useRouter` from `@/i18n/navigation`, not `next/link` or `next/navigation`, so links stay locale-aware. `src/components/locale-switcher.tsx` is the header's language toggle. Zod validation schemas are factories (`createLoginSchema(t)` etc. in `src/lib/validations/`) so form error messages are translated too, not just labels.

## Database

Schema lives in `src/db/schema.ts` (Drizzle). After changing it:

```bash
npm run db:generate   # generate a SQL migration from the schema
npm run db:migrate    # apply migrations
npm run db:studio     # browse data in Drizzle Studio
```

## Requests and logging

- **Server-side**: use `logger` from `src/lib/logger.ts` in route handlers, server actions, or anywhere you'd otherwise `console.log`. Prints readable in `npm run dev`, structured JSON in Docker/prod (`docker compose logs app`). Level via `LOG_LEVEL` (default `info`). Better Auth's internal logs are routed through it too.
- **Client-side requests to your own API**: use `api` from `src/lib/api-client.ts` (`api.get<T>(path, options)`, `api.post<T>(path, body)`, etc.) instead of raw `fetch`. Failures throw a single `ApiError` with `.status` and `.body`. It's deliberately isomorphic and does **not** import the logger — Pino is Node-only and would break the client bundle.
- **Data fetching with cache/loading/retry**: wrap `api-client` calls in a `useQuery`/`useMutation` from TanStack Query (already mounted via `QueryProvider` in the root layout) rather than rolling your own loading state. `src/components/health-status.tsx` is a minimal working example; `src/components/notes-view.tsx` is a fuller one (query + two mutations + optimistic-ish invalidation).

## Example CRUD resource

`/notes` (`src/app/[locale]/notes`, `src/app/api/notes`) is a full reference implementation of the schema → API route → `api-client` → TanStack Query/Table pattern: a Drizzle table owned by the current user, a Zod-validated API route, and a client view with create/sort/delete. Copy this shape for your first real feature, then delete `/notes` (and drop the `note` table from `src/db/schema.ts` + generate a migration) once you don't need the reference.

## API documentation

Two separate OpenAPI docs, since Better Auth generates its own:

- **Auth routes** (`/api/auth/*`): Better Auth's built-in [`openAPI()`](https://www.better-auth.com/docs/plugins/open-api) plugin (enabled in `src/lib/auth.ts`) auto-documents every auth endpoint. With the app running, open `http://localhost:3000/api/auth/reference` for the interactive (Scalar) UI, or `http://localhost:3000/api/auth/open-api/generate-schema` for the raw spec.
- **App routes** (`/api/notes`, `/api/health`): documented via `@swagger` JSDoc comments on each route handler, compiled by `swagger-jsdoc` (`src/lib/openapi.ts`). Raw spec at `http://localhost:3000/api/openapi`, interactive UI at `http://localhost:3000/api-docs`. When adding a route, add a matching `@swagger` block above the handler — `src/app/api/notes/route.ts` is the pattern to copy.

`swagger-jsdoc` reads route source files at request time, which works in dev and after `next build && next start` (verified), but may not in edge/serverless deployments that don't ship raw `.ts` sources — check your target's output file tracing before relying on it in that kind of deploy.

## SEO

`src/app/[locale]/layout.tsx` sets `metadataBase`, OpenGraph/Twitter tags, and a JSON-LD block via `generateMetadata`, all derived from `NEXT_PUBLIC_SITE_URL` (defaults to `http://localhost:3000`) and locale-aware translated title/description. `src/app/robots.ts` and `src/app/sitemap.ts` are Next.js metadata routes and account for locale prefixes — add new public pages to the `routes` array in `sitemap.ts`. `src/app/opengraph-image.tsx` generates a real PNG via `next/og`. `public/llms.txt` gives AI agents/IDE tools a short, structured summary of the project.

## Testing

- **Unit** (`npm test`): Vitest + Testing Library. `src/components/ui/button.test.tsx` is the example.
- **E2E** (`npm run test:e2e`): Playwright, driven against a real browser and a real Postgres — no mocks.
  - `e2e/auth.spec.ts` — sign-up → sign-in → update-profile → delete-account, plus a wrong-password case
  - `e2e/notes.spec.ts` — unauthenticated redirect, then create/delete a note
  - `e2e/i18n.spec.ts` — switches locale via the header and checks translated content
  - `playwright.config.ts` reuses an already-running dev/Docker server locally (`reuseExistingServer`) or builds+starts one itself in CI. `workers: 2` is deliberate — see [Design notes](#design-notes-and-gotchas).

## CI/CD

`.github/workflows/ci.yml` runs three jobs on every push/PR:

1. **build** — `npm ci`, lint, format check, unit tests, `npm run build` (with build-time placeholder env vars, same reasoning as the Dockerfile below)
2. **docker** — builds the production Docker image (`docker/build-push-action`, no push) to catch Dockerfile breakage early
3. **e2e** — spins up a real Postgres service container, migrates it, and runs the full Playwright suite against a built-and-started app

Dependabot (`.github/dependabot.yml`) checks npm and GitHub Actions weekly.

## Docker

- `Dockerfile` — multi-stage (`deps` → `builder` → `runner`), Next.js `output: "standalone"`, runs as a non-root user. The `builder` stage sets placeholder env vars (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) — see [Design notes](#design-notes-and-gotchas) for why.
- `docker-compose.yml` — `db` (Postgres 17, healthchecked via `pg_isready`, host port `5455` by default) and `app` (built from the Dockerfile, healthchecked via `/api/health`, waits for `db` to be healthy).

## Scripts

| Script                 | Purpose                             |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start dev server                    |
| `npm run build`        | Production build                    |
| `npm start`            | Start production server             |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format with Prettier                |
| `npm run format:check` | Check formatting                    |
| `npm test`             | Run unit tests once                 |
| `npm run test:watch`   | Run unit tests in watch mode        |
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
5. Delete `/notes` once you've copied its pattern for your own first feature
6. Add/remove locales in `src/i18n/routing.ts` + `messages/` to match your project's needs

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component>
```

Components are copied into `src/components/ui` — edit them freely, they're yours.

## Design notes and gotchas

Things that weren't obvious while building this, kept here so they don't have to be rediscovered:

- **`middleware.ts` → `proxy.ts`**: Next.js 16 renamed the file convention (same export shape, just a different filename/export name). The old name still half-works with a deprecation warning; `src/proxy.ts` uses the new one.
- **i18n + auth in one middleware**: `next-intl`'s middleware and the auth-protection check both need to run per-request. `src/proxy.ts` composes them manually — check the session cookie first (locale-aware redirect target), then hand off to `next-intl`'s `createMiddleware`.
- **`localePrefix: "as-needed"` double-redirect trap**: with this mode, the default locale has no URL prefix. Redirecting an unauthenticated request to `/${locale}/login` for the default locale produces `/en/login`, which next-intl's own middleware then redirects _again_ to `/login`. Build the redirect target with an empty prefix for the default locale.
- **Docker build needs placeholder env vars**: `next build` evaluates route modules (including ones that only run at request time, like API routes) during "collecting page data," which imports `db`/`auth` and triggers `env.ts`'s Zod validation. The Dockerfile's `builder` stage — and the CI `build` job — set harmless placeholder values; the real ones are injected at container runtime.
- **Docker healthcheck: use `127.0.0.1`, not `localhost`**: inside the Alpine container, `wget`'s `localhost` resolves to `::1` (IPv6) first, but the Next.js server only binds IPv4 — the healthcheck fails with "connection refused" even though the app is up. `docker-compose.yml`'s app healthcheck targets `127.0.0.1` explicitly.
- **Host Postgres port `5455`, not `5432`**: this machine had two native Postgres installs (versions bound to 5432 _and_ 5433), so both common defaults were already taken. `POSTGRES_PORT` in `.env` makes it a one-line fix wherever you deploy this.
- **`api-client.ts` never imports `logger.ts`**: `api-client` is isomorphic (called from both client and server components), but Pino uses Node built-ins (`fs`, `worker_threads`) that can't be bundled for the browser. Keep server-only modules out of anything that might render on the client.
- **Playwright `workers: 2`, not the default (CPU count)**: the default suite is auth-heavy (bcrypt hashing on every sign-up/sign-in) running against a single-core-ish Docker container. Higher worker counts caused real, reproducible timeouts — not app bugs, just resource contention. Lower parallelism first before chasing a "flaky" auth test.
- **Dependabot PRs for paired peer dependencies can't merge independently**: `react` and `react-dom` bumps arrived as separate PRs; merging one alone breaks `npm ci` (`react-dom@X` requires `react@^X`). Check `package.json` peer ranges before merging version-bump PRs that touch either half of a pair.
- **ESLint major bumps aren't free**: bumping `eslint` past what `eslint-config-next`'s bundled `eslint-plugin-react` supports breaks linting outright (`contextOrFilename.getFilename is not a function`). Wait for the config package to catch up rather than forcing the bump.
