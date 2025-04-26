# Use a slim base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
COPY .env .env
RUN npm install --omit=dev

# Copy only necessary files
COPY . .

# Expose port
EXPOSE 5000

# Run using node (not nodemon)
CMD ["node", "server.js"]
