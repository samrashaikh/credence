# ---------- Build stage ----------
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# ---------- Runtime stage ----------
FROM node:22-slim

WORKDIR /app

COPY package*.json ./

# Install dependencies required by the Express server
RUN npm ci

COPY --from=build /app/dist ./dist
COPY server.ts ./server.ts

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]