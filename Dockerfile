# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
WORKDIR /app

# Dependencies layer
FROM base AS deps
COPY package*.json ./
# Use BuildKit cache for faster installs
RUN --mount=type=cache,target=/root/.npm npm ci

# Development stage: Vite dev server
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 5173
# Vite must listen on 0.0.0.0 inside container
CMD ["npm","run","dev","--","--host","0.0.0.0","--strictPort"]

# Build stage
FROM deps AS build
ENV NODE_ENV=production
COPY . .
RUN npm run build

# Production stage: Nginx serving built assets
FROM nginx:1.27-alpine AS prod
# SPA fallback config
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1 