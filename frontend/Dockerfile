ARG NODE_IMAGE=node:22-alpine
ARG PORT=5173

# Stage 1: Base dependencies
FROM ${NODE_IMAGE} AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
EXPOSE ${PORT}

# Stage 2: Development runtime (Hot Reloading Target)
FROM base AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 3: Production builder
FROM base AS builder
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
RUN npm run build

# Stage 4: Production Nginx Server
FROM nginx:alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
