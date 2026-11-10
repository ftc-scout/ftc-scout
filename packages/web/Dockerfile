# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

COPY --link package.json package-lock.json ./
COPY --link packages/common/package.json packages/common/package.json
COPY --link packages/server/package.json packages/server/package.json
COPY --link packages/web/package.json packages/web/package.json
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

# Switch between codegen files between old and docker version
ARG CODEGEN_ENV=ci
ARG SVELTE_CONFIG_ENV=prod

COPY --link . .
COPY ./packages/web/codegen.yml.${CODEGEN_ENV} ./packages/web/codegen.yml
COPY ./packages/web/svelte.config.js.${SVELTE_CONFIG_ENV} ./packages/web/svelte.config.js

# Build application
RUN npm run common:build
RUN npm run web:gen
RUN npm run web:build

# Remove development dependencies
RUN npm prune --omit=dev


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "web:start" ]
