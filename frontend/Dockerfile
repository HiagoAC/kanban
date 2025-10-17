FROM node:25-bookworm-slim

COPY app/package.json app/package-lock.json* ./

WORKDIR /app
EXPOSE 5173

RUN npm update && \
    npm install --ignore-scripts -g vite@latest && \
    npm install --ignore-scripts

COPY ./app /app
