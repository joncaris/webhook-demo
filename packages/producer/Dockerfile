# Use the official Node.js image as the base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json   

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your TypeScript code
RUN npm run build

# Expose the port your app will listen on
EXPOSE 3001

# Start your application
CMD ["node", "dist/index.js"]