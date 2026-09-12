#!/bin/sh
# Runs on the server. Copied here by CI on every push; also invoked by CI
# through the forced-command wrapper (see deploy/ssh-wrapper.sh). Keep this
# script free of secrets/arguments so the forced command can match it as a
# fixed string.
set -e
cd "$(dirname "$0")"
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
