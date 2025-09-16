# Use Node.js official LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (Express runs on 8000)
EXPOSE 8000

# Run server
CMD ["node", "server.js"]
