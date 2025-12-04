FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Verify build exists
RUN ls -la dist/

# Move back to app root
WORKDIR /app

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start from backend directory
CMD ["node", "backend/server.js"]
