# Stage 1: Build the Next.js application
FROM oven/bun:alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb to the working directory
COPY package.json ./
COPY bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN bun run build

#Stage 2: Serve the Next.js appliction
FROM oven/bun:alpine

# Set the working directory
WORKDIR /app

# Copy packeage.json and bun.lockb
COPY package.json bun.lockb ./

#Install production dependencies
RUN bun install --production

# COPY the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./

#Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["bun", "start"]