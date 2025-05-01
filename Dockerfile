# Use a base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Clone the repo
RUN git clone https://github.com/kylevidrine/kyles-jarvis.git

# Set the working directory inside the cloned repo
WORKDIR /usr/src/app/kyles-jarvis

# Install dependencies
RUN npm install

# Expose port if needed (e.g., 3000 for Vite)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
