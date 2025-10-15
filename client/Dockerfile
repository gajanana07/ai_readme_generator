# Build stage
FROM node:20-bullseye AS build

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Accept build argument for VITE server
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Copy source code and build
COPY . .
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config template
COPY ./nginx/default.conf.template /etc/nginx/conf.d/default.conf.template

# Entrypoint script to substitute env vars
COPY ./nginx/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
