# next-template

Base template for future projects: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Vitest, ESLint + Prettier, and Husky pre-commit hooks — all pre-wired.

## Stack

- [Next.js](https://nextjs.org) 16 — App Router, Turbopack
- [TypeScript](https://www.typescriptlang.org) — strict mode
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — copy-in components (`npx shadcn@latest add <component>`)
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — unit/component tests
- ESLint + Prettier (with `prettier-plugin-tailwindcss`)
- Husky + lint-staged — lint/format on commit

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                 | Purpose                 |
| ---------------------- | ----------------------- |
| `npm run dev`          | Start dev server        |
| `npm run build`        | Production build        |
| `npm start`            | Start production server |
| `npm run lint`         | Run ESLint              |
| `npm run format`       | Format with Prettier    |
| `npm run format:check` | Check formatting        |
| `npm test`             | Run tests once          |
| `npm run test:watch`   | Run tests in watch mode |

## Using this as a template

1. Click "Use this template" on GitHub (or `npx degit brenoalvim/next-template my-app`)
2. Update `package.json` name and this README
3. `npm install && npm run dev`

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component>
```

Components are copied into `src/components/ui` — edit them freely, they're yours.
