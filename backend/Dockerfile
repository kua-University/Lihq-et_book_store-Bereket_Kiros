# ============================================
# Lihq'et Bookstore — Backend Dockerfile
# ============================================
# Standalone backend image for flexible deployment
# (Railway, Render, or as a separate Docker Compose service)

FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy dependency manifests from project root
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source code
COPY backend/ ./backend/

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/books || exit 1

# Start the server
CMD ["node", "backend/server.js"]
