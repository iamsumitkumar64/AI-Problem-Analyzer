ARG NODE_IMAGE=node:22-alpine
ARG PORT=8080

# Stage 1: Base runtime & dependency cache
FROM ${NODE_IMAGE} AS base
WORKDIR /app
RUN apk add --no-cache poppler-utils
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
EXPOSE ${PORT}

# Stage 2: Development runtime (Hot Reloading Target)
FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Stage 3: Production builder
FROM base AS builder

# Stage 4: Production runtime
FROM ${NODE_IMAGE} AS prod
WORKDIR /app
RUN apk add --no-cache poppler-utils
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . ./
EXPOSE ${PORT}
CMD ["node", "index.js"]
