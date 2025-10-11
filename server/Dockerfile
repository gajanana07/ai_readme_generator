# Use Node.js official LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Express port
EXPOSE 8000

# Start server
CMD ["node", "server.js"]
