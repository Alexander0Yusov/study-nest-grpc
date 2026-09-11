FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.13.1 --activate

COPY package.json pnpm-lock.yaml nest-cli.json tsconfig.json tsconfig.build.json ./
RUN pnpm install --frozen-lockfile

COPY apps ./apps
COPY libs ./libs
COPY scripts ./scripts

RUN pnpm run build:contracts && pnpm run build:api-gateway

FROM node:22-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@10.13.1 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist/apps/api-gateway ./dist/apps/api-gateway
COPY --from=build /app/scripts/run-migrations.cjs ./scripts/run-migrations.cjs

EXPOSE 3000

CMD ["node", "dist/apps/api-gateway/main.js"]
