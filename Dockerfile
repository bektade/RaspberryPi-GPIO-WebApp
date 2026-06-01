FROM node:20-bookworm-slim AS web-build
WORKDIR /frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ .
ARG API_URL=http://127.0.0.1:5000
ENV API_URL=$API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM python:3.11-slim-bookworm

LABEL org.opencontainers.image.title="Raspberry Pi GPIO Control" \
      org.opencontainers.image.description="Web UI to monitor and control Raspberry Pi GPIO pins." \
      org.opencontainers.image.source="https://github.com/timkn/Raspberry-Pi-GPIO-Control" \
      org.opencontainers.image.url="https://github.com/timkn/Raspberry-Pi-GPIO-Control" \
      org.opencontainers.image.licenses="Apache-2.0"

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY --from=node:20-bookworm-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=node:20-bookworm-slim /usr/local/lib/node_modules /usr/local/lib/node_modules

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir lgpio 2>/dev/null || true

COPY app.py gpio_backend.py ./
COPY --from=web-build /frontend/public ./web/public
COPY --from=web-build /frontend/.next/standalone ./web
COPY --from=web-build /frontend/.next/static ./web/.next/static

COPY scripts/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV API_URL=http://127.0.0.1:5000
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
