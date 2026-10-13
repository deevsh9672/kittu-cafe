FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace and shared
COPY package*.json ./
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# Install & Build shared
RUN npm install
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/backend

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "apps/backend/dist/server.js"]
