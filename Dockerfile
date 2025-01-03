# Use Node.js 21.5.0
FROM node:21.5.0-bookworm

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
