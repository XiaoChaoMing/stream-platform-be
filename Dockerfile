FROM node:18-alpine as builder

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install

# Copy application code
COPY . .

# Generate Prisma client first
RUN npx prisma generate

# Build application
RUN pnpm build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install build essentials for bcrypt and FFmpeg
RUN apk add --no-cache python3 make g++ ffmpeg

# Copy package files and install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
    pnpm install --prod

# Copy Prisma schema and migrations
COPY prisma ./prisma/
RUN npx prisma generate

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Rebuild bcrypt
RUN cd node_modules/bcrypt && npm rebuild

# Create startup script with database connection check
RUN echo -e '#!/bin/sh\n\
echo "Waiting for database to be ready..."\n\
max_retries=30\n\
counter=0\n\
until npx prisma db push --skip-generate --accept-data-loss || [ $counter -eq $max_retries ]; do\n\
  echo "Database connection attempt $counter of $max_retries..."\n\
  sleep 2\n\
  counter=$((counter+1))\n\
done\n\
\n\
if [ $counter -eq $max_retries ]; then\n\
  echo "Failed to connect to database after $max_retries attempts!"\n\
  exit 1\n\
fi\n\
\n\
echo "Running Prisma migrations..."\n\
npx prisma migrate deploy\n\
echo "Starting application..."\n\
node dist/main\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production \
    DATABASE_URL="mysql://root:xinhayquendi1@mysql:3306/stream_platform"

# Start the application with our custom script
CMD ["/app/start.sh"] 