#!/bin/sh
set -e
cd "$(dirname "$0")"
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
