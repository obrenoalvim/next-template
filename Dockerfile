# --- deps ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# --- build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time placeholders only — real values are injected at runtime by docker-compose.
# Needed because route analysis at build time loads env-validated modules (db, auth).
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV BETTER_AUTH_SECRET="build-time-placeholder-secret-not-used-at-runtime"
ENV BETTER_AUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
RUN npm run build

# --- runtime ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
