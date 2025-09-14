FROM node:20-alpine

# App directory
WORKDIR /app

# Install dependencies first (use lockfile if present)
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# Copy the rest of the source
COPY . .

# Expose app port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

