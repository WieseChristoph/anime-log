FROM node:24.15-alpine AS base

RUN corepack enable pnpm

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies from the checked-in pnpm lockfile.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./ ./
RUN pnpm install --frozen-lockfile

# Migration image. This intentionally contains the Prisma CLI and source
# migration files, while the web image below contains only the Next.js runtime.
FROM deps AS migrator
WORKDIR /app
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

USER nextjs

CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_UMAMI_SCRIPT_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID

ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_STANDALONE=true
ENV NEXT_PUBLIC_UMAMI_SCRIPT_URL=$NEXT_PUBLIC_UMAMI_SCRIPT_URL
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID

RUN DATABASE_URL="postgres://dummy:dummy@dummy:5432/dummy" pnpm exec prisma generate
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80

ENV PORT=80
ENV HOSTNAME=0.0.0.0

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
