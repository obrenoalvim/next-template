[English](README.md) | Português

# next-template

Template base pronto pra produção pra novos projetos: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Postgres + Drizzle, Better Auth (email/senha, verificação de email, redefinição de senha, rate limiting), i18n, dark mode, log estruturado e Docker — tudo já configurado e testado de ponta a ponta. Clona, roda um comando, e já começa pela sua primeira feature em vez da quinta integração de auth.

## Conteúdo

- [Stack](#stack)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Começando (Docker)](#começando-docker--recomendado)
- [Começando (sem Docker)](#começando-sem-docker)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Auth](#auth)
- [Email](#email)
- [i18n](#i18n)
- [Banco de dados](#banco-de-dados)
- [Requests e logs](#requests-e-logs)
- [Recurso CRUD de exemplo](#recurso-crud-de-exemplo)
- [SEO](#seo)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Docker](#docker-1)
- [Scripts](#scripts)
- [Usando isso como template](#usando-isso-como-template)
- [Adicionando componentes shadcn/ui](#adicionando-componentes-shadcnui)
- [Notas de design e pegadinhas](#notas-de-design-e-pegadinhas)

## Stack

- [Next.js](https://nextjs.org) 16 — App Router, Turbopack
- [TypeScript](https://www.typescriptlang.org) — modo strict
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) — componentes copiados pro projeto (`npx shadcn@latest add <component>`)
- [Postgres](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com) — login email/senha, cookies de sessão, verificação de email, redefinição de senha, rate limiting
- [next-intl](https://next-intl.dev) — i18n: `en` (padrão, sem prefixo) + `pt`, seletor de idioma no header
- Email (verificação + redefinição de senha) via senha de app do Gmail (SMTP), com fallback pro console em dev
- [next-themes](https://github.com/pacocoursey/next-themes) — alternância claro/escuro no header
- [Sonner](https://sonner.emilkowal.ski) — notificações toast pro feedback de auth
- [Zod](https://zod.dev) — valida env vars obrigatórias no startup, falha rápido com mensagem clara; também valida todo schema de formulário
- [React Hook Form](https://react-hook-form.com) + Zod — formulários validados por schema em login/registro/conta/notas
- [Pino](https://getpino.io) — log estruturado no servidor, bonito em dev, JSON em prod
- `src/lib/api-client.ts` — fetch tipado pras próprias rotas `/api/*`, um único formato de `ApiError` em vez de try/catch espalhado
- [TanStack Query](https://tanstack.com/query) — cache/loading/retry pra busca de dados no client
- [TanStack Table](https://tanstack.com/table) — tabela com ordenação, usada no exemplo de notas
- `/api/health` — checa conexão com o banco, usado pelo healthcheck do Docker
- `not-found.tsx` / `error.tsx` customizados
- [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) — testes unitários/de componente
- [Playwright](https://playwright.dev) — E2E: fluxo de auth, CRUD de notas, troca de idioma
- ESLint + Prettier (com `prettier-plugin-tailwindcss`)
- Husky + lint-staged — lint/format no commit
- Docker + docker-compose — app e Postgres containerizados
- CI no GitHub Actions — build+lint+test, build da imagem Docker, e uma suíte E2E completa contra um Postgres real
- SEO: `robots.ts`, `sitemap.ts`, meta OG/Twitter, imagem OG dinâmica, JSON-LD, URLs canônicas, `public/llms.txt`

## Estrutura do projeto

```
src/
  app/
    [locale]/            # toda página vive aqui — layout.tsx é o layout raiz de fato
      layout.tsx          # html/body, providers (tema, query, i18n), header/footer
      page.tsx             # home
      login/, register/, forgot-password/, reset-password/
      dashboard/, account/, notes/     # protegidas (ver proxy.ts)
      routes/               # lista toda página + rota de API
      not-found.tsx, error.tsx
    api/
      auth/[...all]/route.ts   # handler do Better Auth
      health/route.ts
      notes/route.ts, notes/[id]/route.ts
    robots.ts, sitemap.ts, opengraph-image.tsx   # sem localização, nível raiz
    globals.css
  components/
    header.tsx, footer.tsx, theme-toggle.tsx, theme-provider.tsx
    locale-switcher.tsx, query-provider.tsx
    account-forms.tsx, notes-view.tsx, health-status.tsx
    ui/                    # componentes shadcn — seus pra editar
  db/
    index.ts               # client do drizzle
    schema.ts               # user/session/account/verification (Better Auth) + note (exemplo)
  i18n/
    routing.ts, navigation.ts, request.ts
  lib/
    auth.ts, auth-client.ts    # config do Better Auth server/client
    email.ts, email-templates.ts
    env.ts                  # env vars validadas com zod
    logger.ts                # pino
    api-client.ts
    utils.ts
    validations/            # factories de schema zod (traduzíveis)
  proxy.ts                  # proteção de rota + middleware de i18n (middleware.ts do Next.js 16)
messages/
  en.json, pt.json           # traduções do next-intl
e2e/
  auth.spec.ts, notes.spec.ts, i18n.spec.ts
drizzle/                    # migrations SQL geradas — commitar
```

## Começando (Docker — recomendado)

```bash
cp .env.example .env
# gera um secret real e coloca em .env como BETTER_AUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

docker compose up -d db          # sobe só o Postgres
npm run db:migrate               # aplica o schema (primeira vez / após mudanças)
docker compose up -d --build     # builda e sobe o app também
```

App: [http://localhost:3000](http://localhost:3000). O Postgres é exposto na porta `5455` do host por padrão (não `5432`, pra evitar conflito com um Postgres local — troque `POSTGRES_PORT` no `.env` se precisar).

`npm run docker:up` / `npm run docker:down` são atalhos pra `docker compose up --build` / `docker compose down`.

## Começando (sem Docker)

Requer uma instância Postgres acessível em `DATABASE_URL`.

```bash
cp .env.example .env   # aponta DATABASE_URL pro seu próprio Postgres
npm install
npm run db:migrate
npm run dev
```

## Variáveis de ambiente

Veja `.env.example` pra lista completa e comentada. Resumo:

| Variável                            | Obrigatória | Propósito                                                      |
| ----------------------------------- | ----------- | -------------------------------------------------------------- |
| `DATABASE_URL`                      | sim         | String de conexão do Postgres                                  |
| `BETTER_AUTH_SECRET`                | sim         | ≥32 caracteres; assinatura de sessão/token                     |
| `BETTER_AUTH_URL`                   | sim         | URL base server-side do Better Auth                            |
| `NEXT_PUBLIC_BETTER_AUTH_URL`       | sim         | URL base client-side do auth client                            |
| `POSTGRES_USER/PASSWORD/DB/PORT`    | só Docker   | Padrões do `docker-compose.yml`                                |
| `NEXT_PUBLIC_SITE_URL`              | não         | metadataBase, URLs canônicas, robots/sitemap; padrão localhost |
| `LOG_LEVEL`                         | não         | nível do pino: debug/info/warn/error; padrão `info`            |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | não         | Envia email real; sem elas, emails são logados no console      |

`src/lib/env.ts` valida as obrigatórias com Zod no startup (servidor + build do Docker) — var faltando/inválida falha rápido com mensagem legível em vez de erro obscuro depois.

## Auth

Better Auth configurado com provider email/senha (`src/lib/auth.ts` no servidor, `src/lib/auth-client.ts` no client). Rotas:

- `/login`, `/register` — formulários de login / cadastro
- `/forgot-password`, `/reset-password` — redefinição de senha por email (ver [Email](#email))
- `/dashboard` — página protegida de exemplo, redireciona pra `/login` sem sessão
- `/account` — página protegida: atualizar nome, trocar senha, excluir conta
- `/api/auth/[...all]` — handler de rota do Better Auth
- Rate limited: 5 tentativas de login/cadastro por 60s por IP (ver `rateLimit` em `src/lib/auth.ts`)
- `/routes` lista toda página e rota de API do template
- `src/proxy.ts` (substituto do `middleware.ts` no Next.js 16) protege centralmente `/dashboard`, `/account`, `/notes`, `/admin` — adiciona um caminho em `protectedPaths` e já tá coberto, sem redirect por página. É uma checagem otimista de cookie pra UX; as páginas ainda chamam `auth.api.getSession()` no servidor como o gate real. Também roda o middleware de locale do next-intl na mesma passada.

**Sessões**: sem wiring manual de refresh token aqui — o Better Auth gerencia o tempo de vida e renovação da sessão internamente via cookie assinado próprio, diferente dos backends token-based dessa família de templates (`back-template-nest`, `back-template-laravel`, `back-template-spring`), que cada um implementa na mão um access token de vida curta + refresh token de vida mais longa e revogável. Se você trocar o Better Auth por um fluxo de auth token-based, precisa adicionar isso você mesmo — ver os READMEs desses repos pro padrão.

## Roles

Todo usuário tem um `role` (`'user'` | `'admin'`, default `'user'`) via o plugin nativo [`admin()`](https://www.better-auth.com/docs/plugins/admin) do Better Auth (`src/lib/auth.ts` no servidor, `adminClient()` em `src/lib/auth-client.ts` no client) — nunca confia num `role` vindo do body da requisição. `/admin` (`src/app/[locale]/admin/page.tsx`) é a referência pra uma página admin-only: ela re-checa `session.user.role === "admin"` no servidor e redireciona senão (a entrada no `proxy.ts` acima é só uma checagem otimista de UX, mesma ressalva dos outros caminhos protegidos). Ela lista todos os usuários via `auth.api.listUsers()` do próprio plugin — sem endpoint customizado. Sem promoção self-serve — muda a coluna direto no banco (`UPDATE "user" SET role = 'admin' WHERE email = '...'`) pra testar localmente.

## Email

Emails de verificação (enviados no cadastro) e de redefinição de senha passam por SMTP do Gmail via `src/lib/email.ts` + `src/lib/email-templates.ts`. Sem `GMAIL_USER`/`GMAIL_APP_PASSWORD`, os emails são logados no console (`docker compose logs app`) em vez de enviados — sem setup necessário pra testar o fluxo localmente. Pra enviar email de verdade: ativa 2FA numa conta Gmail, gera uma [App Password](https://myaccount.google.com/apppasswords), e seta as duas env vars. Troca o transporter em `src/lib/email.ts` por um provedor de verdade (Resend, SES, Postmark) quando ultrapassar o limite de envio do Gmail.

## i18n

Os idiomas ficam em `messages/en.json` e `messages/pt.json`; config de rotas em `src/i18n/routing.ts` (adiciona um idioma no array `locales` e cria o `messages/<code>.json` correspondente). `en` é o padrão e sem prefixo (`/login`), outros idiomas têm prefixo (`/pt/login`) — ver `localePrefix: "as-needed"` em `src/i18n/routing.ts`. Server components usam `getTranslations`/`setRequestLocale` de `next-intl/server`; client components usam `useTranslations`. Sempre importa `Link`/`redirect`/`useRouter` de `@/i18n/navigation`, não de `next/link` ou `next/navigation`, pra links continuarem cientes do idioma. `src/components/locale-switcher.tsx` é o botão de troca de idioma no header. Schemas de validação Zod são factories (`createLoginSchema(t)` etc. em `src/lib/validations/`) então mensagens de erro de formulário também são traduzidas, não só os labels.

## Banco de dados

Schema fica em `src/db/schema.ts` (Drizzle). Depois de mudar:

```bash
npm run db:generate   # gera uma migration SQL a partir do schema
npm run db:migrate    # aplica migrations
npm run db:studio     # navega os dados no Drizzle Studio
```

## Requests e logs

- **Server-side**: usa `logger` de `src/lib/logger.ts` em route handlers, server actions, ou onde você usaria `console.log`. Imprime legível em `npm run dev`, JSON estruturado no Docker/prod (`docker compose logs app`). Nível via `LOG_LEVEL` (padrão `info`). Os logs internos do Better Auth também passam por ele.
- **Requests client-side pra própria API**: usa `api` de `src/lib/api-client.ts` (`api.get<T>(path, options)`, `api.post<T>(path, body)`, etc.) em vez de `fetch` cru. Falhas lançam um único `ApiError` com `.status` e `.body`. É isomórfico de propósito e **não** importa o logger — Pino usa recursos do Node e quebraria o bundle do client.
- **Busca de dados com cache/loading/retry**: envolve chamadas do `api-client` num `useQuery`/`useMutation` do TanStack Query (já montado via `QueryProvider` no layout raiz) em vez de fazer seu próprio loading state. `src/components/health-status.tsx` é um exemplo mínimo funcionando; `src/components/notes-view.tsx` é um mais completo (query + duas mutations + invalidação).

## Recurso CRUD de exemplo

`/notes` (`src/app/[locale]/notes`, `src/app/api/notes`) é uma implementação de referência completa do padrão schema → rota de API → `api-client` → TanStack Query/Table: uma tabela Drizzle pertencente ao usuário atual, uma rota de API validada com Zod, e uma view client com criar/ordenar/excluir. Copia esse formato pra sua primeira feature de verdade, depois apaga `/notes` (e a tabela `note` de `src/db/schema.ts` + gera uma migration) quando não precisar mais da referência.

## Documentação da API

Dois docs OpenAPI separados, já que o Better Auth gera o próprio:

- **Rotas de auth** (`/api/auth/*`): o plugin nativo [`openAPI()`](https://www.better-auth.com/docs/plugins/open-api) do Better Auth (ligado em `src/lib/auth.ts`) documenta cada endpoint de auth automaticamente. Com o app rodando, abre `http://localhost:3000/api/auth/reference` pra UI interativa (Scalar), ou `http://localhost:3000/api/auth/open-api/generate-schema` pro spec bruto.
- **Rotas do app** (`/api/notes`, `/api/health`): documentadas via comentários JSDoc `@swagger` em cada route handler, compilados pelo `swagger-jsdoc` (`src/lib/openapi.ts`). Spec bruto em `http://localhost:3000/api/openapi`, UI interativa em `http://localhost:3000/api-docs`. Ao adicionar uma rota, adiciona um bloco `@swagger` correspondente acima do handler — `src/app/api/notes/route.ts` é o padrão pra copiar.

`swagger-jsdoc` lê os arquivos fonte das rotas em tempo de request, o que funciona em dev e depois de `next build && next start` (verificado), mas pode não funcionar em deploys edge/serverless que não embarcam os `.ts` fonte — confere o output file tracing do teu alvo antes de depender disso nesse tipo de deploy.

## SEO

`src/app/[locale]/layout.tsx` seta `metadataBase`, tags OpenGraph/Twitter, e um bloco JSON-LD via `generateMetadata`, tudo derivado de `NEXT_PUBLIC_SITE_URL` (padrão `http://localhost:3000`) e título/descrição traduzidos por idioma. `src/app/robots.ts` e `src/app/sitemap.ts` são rotas de metadata do Next.js e consideram prefixos de idioma — adiciona novas páginas públicas no array `routes` de `sitemap.ts`. `src/app/opengraph-image.tsx` gera um PNG de verdade via `next/og`. `public/llms.txt` dá pra agentes de IA/ferramentas de IDE um resumo curto e estruturado do projeto.

## Testes

- **Unitário** (`npm test`): Vitest + Testing Library. `src/components/ui/button.test.tsx` é o exemplo.
- **E2E** (`npm run test:e2e`): Playwright, rodando contra browser real e Postgres real — sem mocks.
  - `e2e/auth.spec.ts` — cadastro → login → atualizar perfil → excluir conta, mais um caso de senha errada
  - `e2e/notes.spec.ts` — redirect sem sessão, depois criar/excluir uma nota
  - `e2e/i18n.spec.ts` — troca idioma pelo header e checa conteúdo traduzido
  - `playwright.config.ts` reusa um servidor dev/Docker já rodando localmente (`reuseExistingServer`) ou builda+sobe um no CI. `workers: 2` é proposital — ver [Notas de design](#notas-de-design-e-pegadinhas).

## CI/CD

`.github/workflows/ci.yml` roda três jobs a cada push/PR:

1. **build** — `npm ci`, lint, format check, testes unitários, `npm run build` (com env vars placeholder de build-time, mesmo motivo do Dockerfile abaixo)
2. **docker** — builda a imagem Docker de produção (`docker/build-push-action`, sem push) pra pegar quebra de Dockerfile cedo
3. **e2e** — sobe um Postgres real como service container, migra, e roda a suíte Playwright completa contra o app buildado e rodando

Dependabot (`.github/dependabot.yml`) checa npm e GitHub Actions semanalmente.

## Docker

- `Dockerfile` — multi-stage (`deps` → `builder` → `runner`), Next.js `output: "standalone"`, roda como usuário non-root. O estágio `builder` seta env vars placeholder (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) — ver [Notas de design](#notas-de-design-e-pegadinhas) pro motivo.
- `docker-compose.yml` — `db` (Postgres 17, healthcheck via `pg_isready`, porta `5455` do host por padrão) e `app` (buildado do Dockerfile, healthcheck via `/api/health`, espera `db` ficar saudável).

## Scripts

| Script                 | Propósito                             |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | Sobe o servidor de dev                |
| `npm run build`        | Build de produção                     |
| `npm start`            | Sobe o servidor de produção           |
| `npm run lint`         | Roda o ESLint                         |
| `npm run format`       | Formata com Prettier                  |
| `npm run format:check` | Checa formatação                      |
| `npm test`             | Roda testes unitários uma vez         |
| `npm run test:watch`   | Roda testes unitários em modo watch   |
| `npm run test:e2e`     | Roda os testes E2E do Playwright      |
| `npm run db:generate`  | Gera uma migration a partir do schema |
| `npm run db:migrate`   | Aplica migrations                     |
| `npm run db:studio`    | Abre o Drizzle Studio                 |
| `npm run docker:up`    | `docker compose up --build`           |
| `npm run docker:down`  | `docker compose down`                 |

## Usando isso como template

1. Clica em "Use this template" no GitHub (ou `npx degit obrenoalvim/next-template my-app`)
2. Atualiza o nome em `package.json` e este README
3. `cp .env.example .env`, seta um `BETTER_AUTH_SECRET` real
4. `docker compose up -d db && npm run db:migrate && npm run dev`
5. Apaga `/notes` depois de copiar o padrão pra sua própria primeira feature
6. Adiciona/remove idiomas em `src/i18n/routing.ts` + `messages/` conforme a necessidade do projeto

## Adicionando componentes shadcn/ui

```bash
npx shadcn@latest add <component>
```

Componentes são copiados pra `src/components/ui` — edita à vontade, são seus.

## Notas de design e pegadinhas

Coisas que não eram óbvias construindo isso, guardadas aqui pra não precisar redescobrir:

- **`middleware.ts` → `proxy.ts`**: Next.js 16 renomeou a convenção de arquivo (mesmo formato de export, só nome de arquivo/export diferente). O nome antigo ainda meio-funciona com aviso de depreciação; `src/proxy.ts` já usa o novo.
- **i18n + auth num middleware só**: o middleware do `next-intl` e a checagem de proteção de auth precisam rodar por request. `src/proxy.ts` compõe os dois manualmente — checa o cookie de sessão primeiro (alvo de redirect ciente do idioma), depois passa pro `createMiddleware` do next-intl.
- **Armadilha do double-redirect no `localePrefix: "as-needed"`**: nesse modo, o idioma padrão não tem prefixo na URL. Redirecionar um request sem sessão pra `/${locale}/login` no idioma padrão gera `/en/login`, que o próprio middleware do next-intl redireciona _de novo_ pra `/login`. Constrói o alvo do redirect com prefixo vazio pro idioma padrão.
- **Build do Docker precisa de env vars placeholder**: `next build` avalia módulos de rota (inclusive os que só rodam em request-time, tipo rotas de API) durante o "collecting page data", que importa `db`/`auth` e dispara a validação Zod do `env.ts`. O estágio `builder` do Dockerfile — e o job `build` do CI — setam valores placeholder inofensivos; os de verdade entram em runtime do container.
- **Healthcheck do Docker: usa `127.0.0.1`, não `localhost`**: dentro do container Alpine, `localhost` no `wget` resolve pra `::1` (IPv6) primeiro, mas o servidor Next.js só escuta IPv4 — o healthcheck falha com "connection refused" mesmo com o app no ar. O healthcheck do app no `docker-compose.yml` mira `127.0.0.1` explicitamente.
- **Porta `5455` do Postgres no host, não `5432`**: essa máquina tinha dois Postgres nativos instalados (versões ocupando 5432 _e_ 5433), então os dois padrões comuns já tavam tomados. `POSTGRES_PORT` no `.env` deixa isso um ajuste de uma linha em qualquer lugar que você suba isso.
- **`api-client.ts` nunca importa `logger.ts`**: `api-client` é isomórfico (chamado de client e server components), mas Pino usa recursos nativos do Node (`fs`, `worker_threads`) que não dá pra empacotar pro browser. Mantém módulos server-only fora de qualquer coisa que possa renderizar no client.
- **Playwright `workers: 2`, não o padrão (contagem de CPU)**: a suíte é pesada em auth (hash bcrypt a cada cadastro/login) rodando contra um container Docker meio single-core. Contagem maior de workers causou timeouts reais e reproduzíveis — não bug de app, contenção de recurso mesmo. Reduz o paralelismo antes de sair caçando teste "flaky".
- **PRs do Dependabot de dependências pareadas não mergeiam sozinhas**: bumps de `react` e `react-dom` chegaram como PRs separadas; mergear uma sozinha quebra `npm ci` (`react-dom@X` exige `react@^X`). Confere os ranges de peer dependency no `package.json` antes de mergear PR de bump de versão que mexe só numa metade do par.
- **Bump major de ESLint não é de graça**: subir `eslint` além do que o `eslint-plugin-react` empacotado no `eslint-config-next` suporta quebra o lint de vez (`contextOrFilename.getFilename is not a function`). Espera o pacote de config se atualizar em vez de forçar o bump.
