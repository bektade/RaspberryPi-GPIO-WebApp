#!/usr/bin/env bash
set -euo pipefail

DOCKER_USER="${DOCKER_USER:-becktkh}"
TAG="${TAG:-latest}"
PORT="${PORT:-8080}"
REPO_RAW="${REPO_RAW:-https://raw.githubusercontent.com/bektade/RaspberryPi-GPIO-WebApp/master/python-gpio-control}"
INSTALL_DIR="${INSTALL_DIR:-$HOME/.rp-gpio-control}"

mkdir -p "$INSTALL_DIR"
curl -fsSL "${REPO_RAW}/docker-compose.hub.yml" -o "${INSTALL_DIR}/docker-compose.hub.yml"

export DOCKER_USER TAG PORT

cd "$INSTALL_DIR"

echo "Pulling ${DOCKER_USER}/rp-gpio-api:${TAG} and ${DOCKER_USER}/rp-gpio-web:${TAG} ..."
docker compose -f docker-compose.hub.yml pull

echo "Starting GPIO control stack on port ${PORT} ..."
docker compose -f docker-compose.hub.yml up -d

host="$(hostname -I 2>/dev/null | awk '{print $1}')"
echo ""
echo "→ http://${host:-localhost}:${PORT}"
echo ""
echo "Stop:  cd ${INSTALL_DIR} && docker compose -f docker-compose.hub.yml down"
echo "Logs:  cd ${INSTALL_DIR} && docker compose -f docker-compose.hub.yml logs -f"
