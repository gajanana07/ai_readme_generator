# ---------- Build stage ----------
FROM node:20-bullseye AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Accept build argument for Vite and Nginx
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Copy source and build frontend
COPY . .
RUN npm run build   # builds static files into /app/dist


# ---------- Serve stage ----------
FROM nginx:alpine

# Accept the same build arg again
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Copy static files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy and replace placeholder in nginx.conf
COPY nginx/templates/default.conf.template /tmp/default.conf.template

# Replace the variable at build time
RUN envsubst '$VITE_SERVER_URL' < /tmp/default.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
