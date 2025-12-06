# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Build arguments for environment variables
ARG REACT_APP_API_BASE_URL=http://localhost:4000
ARG REACT_APP_WS_URL=ws://localhost:4000/ws/playlist/

# Set environment variables from build args
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
