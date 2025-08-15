# Multi-stage Dockerfile for Angular production build served by Nginx

# 1) Build stage
FROM node:20-alpine AS build

# Set workdir
WORKDIR /app

# Install OS deps often needed by node-gyp (if native deps exist)
RUN apk add --no-cache python3 make g++

# Only copy package manifests first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --no-audit --no-fund

# Copy the rest of the source
COPY . .

# Optional: build arguments to customize Angular base href if needed
# You can pass at build time: --build-arg BASE_HREF=/
ARG BASE_HREF=/
ENV BASE_HREF=${BASE_HREF}

# Build Angular app for production
# If your project name differs (dist folder name), adjust below accordingly.
RUN npm run build -- --configuration production --base-href ${BASE_HREF}

# 2) Runtime stage with Nginx
FROM nginx:1.27-alpine AS runtime

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app to Nginx html directory
# Adjust the dist path if your Angular output path differs
# Common patterns: dist/<project-name>/browser or dist/<project-name>
# We'll copy anything under dist to avoid guessing exact subfolder
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Healthcheck: ensure Nginx serves index
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

# Default command
CMD ["nginx", "-g", "daemon off;"]
