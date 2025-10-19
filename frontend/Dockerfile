FROM node:25-bookworm-slim

WORKDIR /app
EXPOSE 5173

COPY app/package.json app/package-lock.json* ./

RUN npm ci && npm cache clean --force

COPY ./app /app
