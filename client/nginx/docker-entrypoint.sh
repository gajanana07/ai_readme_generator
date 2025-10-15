#!/bin/sh
set -e

# -----------------------------
# Parse VITE_SERVER_URL safely
# -----------------------------

# Default backend if VITE_SERVER_URL is not set
DEFAULT_HOST="127.0.0.1"
DEFAULT_PORT="8000"

if [ -n "$VITE_SERVER_URL" ]; then
    # Remove http:// or https:// and any trailing slash
    VITE_SERVER_CLEAN=$(echo "$VITE_SERVER_URL" | sed -E 's#https?://##' | sed 's#/$##')

    # Extract host and port
    VITE_SERVER_HOST=$(echo "$VITE_SERVER_CLEAN" | cut -d':' -f1)
    VITE_SERVER_PORT=$(echo "$VITE_SERVER_CLEAN" | cut -d':' -f2)
fi

# Use defaults if host or port are empty
VITE_SERVER_HOST=${VITE_SERVER_HOST:-$DEFAULT_HOST}
VITE_SERVER_PORT=${VITE_SERVER_PORT:-$DEFAULT_PORT}

export VITE_SERVER_HOST VITE_SERVER_PORT

echo "Using backend host: $VITE_SERVER_HOST, port: $VITE_SERVER_PORT"

# -----------------------------
# Substitute environment variables in Nginx template
# -----------------------------
envsubst '${VITE_SERVER_HOST} ${VITE_SERVER_PORT}' \
    < /etc/nginx/conf.d/default.conf.template \
    > /etc/nginx/conf.d/default.conf

# -----------------------------
# Start Nginx
# -----------------------------
exec "$@"
