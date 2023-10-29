# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /src/usr/app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy your application code to the container
COPY . .
COPY .env .env

# Command to start your application
CMD ["node", "app.js"]
