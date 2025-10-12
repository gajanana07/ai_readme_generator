# Build stage
FROM node:20-bullseye AS build

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Accept build argument for VITE_SERVER_URL
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL

# Copy source code and build
COPY . .
RUN npm run build   # builds static files into /app/dist

# Serve stage
FROM nginx:alpine

# Copy static build files to Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
