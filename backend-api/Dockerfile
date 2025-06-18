# Build stage
FROM node:18-alpine AS builder
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /src
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Security hardening
RUN apk add --no-cache dumb-init
USER node

EXPOSE 8000
CMD ["dumb-init", "node", "dist/server.js"]