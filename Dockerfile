FROM node:18 as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN pnpm build

# Production stage - same node version for binary compatibility
FROM node:18

WORKDIR /app

# Install build essentials for bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install global pnpm
RUN npm install -g pnpm

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Install production dependencies and rebuild bcrypt
RUN pnpm install --prod
RUN cd node_modules/bcrypt && npm rebuild

# Generate Prisma client in production stage
RUN npx prisma generate

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Running Prisma migrations..."\n\
npx prisma migrate deploy\n\
echo "Starting application..."\n\
npm run start:prod\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application with our custom script
CMD ["/app/start.sh"] 