# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the entire project
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
