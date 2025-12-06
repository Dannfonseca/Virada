# ==========================================
# Stage 1: Build Frontend
# ==========================================
FROM node:18-alpine as frontend-build

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ .
RUN npm run build

# ==========================================
# Stage 2: Setup Backend & Serve
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend/ .

# Copy built frontend assets from Stage 1
# The backend expects frontend at /app/frontend/dist based on server.js logic
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
