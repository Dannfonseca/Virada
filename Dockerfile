# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy source code
COPY backend ./backend
COPY frontend ./frontend

# Build frontend and verify
RUN cd frontend && npm run build && ls -la dist/

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy backend with node_modules
COPY --from=builder /app/backend ./backend

# Copy frontend build
COPY --from=builder /app/frontend/dist ./frontend/dist

# Verify frontend dist exists
RUN ls -la /app/frontend/dist/

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start the application from root
WORKDIR /app/backend
CMD ["npm", "start"]
