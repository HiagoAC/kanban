FROM node:25-bookworm-slim

WORKDIR /app

# Build args to match your host's UID/GID
ARG UID=1000
ARG GID=1000
RUN groupmod -g ${GID} node && usermod -u ${UID} -g ${GID} node

COPY app/package*.json ./

RUN chown -R node:node /app

USER node

RUN npm ci && npm cache clean --force

COPY --chown=node:node ./app /app

EXPOSE 5173
