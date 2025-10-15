#!/bin/sh
set -e

# Extract host and port from VITE_SERVER_URL
if [ -n "$VITE_SERVER_URL" ]; then
    export VITE_SERVER_HOST=$(echo $VITE_SERVER_URL | sed -E 's#http://([^:/]+):([0-9]+).*#\1#')
    export VITE_SERVER_PORT=$(echo $VITE_SERVER_URL | sed -E 's#http://([^:/]+):([0-9]+).*#\2#')
fi

# Substitute environment variables in Nginx template
envsubst '${VITE_SERVER_HOST} ${VITE_SERVER_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx
exec "$@"
