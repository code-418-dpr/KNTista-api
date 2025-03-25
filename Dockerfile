ARG NODE_VERSION=23
FROM node:${NODE_VERSION}-alpine AS base
RUN --mount=type=cache,target=/root/.npm \
    npm i -g pnpm@latest-10
WORKDIR /app
COPY package.json .

FROM base AS prod-deps
COPY pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i -P --frozen-lockfile --ignore-scripts

FROM prod-deps AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i --frozen-lockfile --ignore-scripts

FROM deps AS build
COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM prod-deps AS release
COPY .env* .
COPY src/drizzle/types ./src/drizzle/types
COPY src/drizzle/drizzle.schema.ts ./src/drizzle/drizzle.schema.ts
COPY drizzle.config.ts .
COPY --from=build /app/dist dist

USER node
EXPOSE 3000
CMD ["sh", "-c", "pnpm db:push && pnpm start:prod"]
