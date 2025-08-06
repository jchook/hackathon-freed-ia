# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache postgresql-client curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
#COPY . .

# Build the application
#RUN npm run build

# Expose port
EXPOSE 5001

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
#  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "run", "dev"]
