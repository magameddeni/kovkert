FROM node:18-alpine3.18 AS base

RUN apk --no-cache add bash

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
# Omit --production flag for TypeScript devDependencies
RUN yarn --frozen-lockfile

COPY . .

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ARG NEXT_PUBLIC_SERVER
ENV NEXT_PUBLIC_SERVER=${NEXT_PUBLIC_SERVER}
ARG NEXT_PUBLIC_MAP_KEY
ENV NEXT_PUBLIC_MAP_KEY=${NEXT_PUBLIC_MAP_KEY}
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ARG NEXT_PUBLIC_VAPID_KEY
ENV NEXT_PUBLIC_VAPID_KEY=${NEXT_PUBLIC_VAPID_KEY}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at build time
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js based on the preferred package manager
RUN yarn sitemap
RUN yarn build
# Note: It is not necessary to add an intermediate step that does a full copy of `node_modules` here

# Step 2. Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
ARG NEXT_PUBLIC_SERVER
ENV NEXT_PUBLIC_SERVER=${NEXT_PUBLIC_SERVER}
ARG NEXT_PUBLIC_MAP_KEY
ENV NEXT_PUBLIC_MAP_KEY=${NEXT_PUBLIC_MAP_KEY}
ARG NEXT_PUBLIC_SENTRY_DSN
ENV NEXT_PUBLIC_SENTRY_DSN=${NEXT_PUBLIC_SENTRY_DSN}
ARG NEXT_PUBLIC_VAPID_KEY
ENV NEXT_PUBLIC_VAPID_KEY=${NEXT_PUBLIC_VAPID_KEY}

# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED=1

# Note: Don't expose ports here, Compose will handle that for us

CMD ["node", "server.js"]
