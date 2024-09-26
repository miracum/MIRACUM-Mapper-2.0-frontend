# Development stage
FROM node:16-alpine

# Install Git
RUN apk add --no-cache git

# Create a node user and group
# RUN addgroup -S node && adduser -S node -G node

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Change ownership to node user
# RUN chown -R node:node /app

# Switch to node user
# USER node

# Expose port 5173
EXPOSE 5173

# Command to run the application
# CMD ["npm", "run", "serve"]