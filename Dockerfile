# Use a slim Node.js base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application files (including .env)
COPY . .
# Expose port
EXPOSE 5000

# Start the server using node
CMD ["node", "server.js"]
