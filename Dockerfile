# Step 1: Use an official Node.js runtime as a parent image
FROM node:latest

# Step 2: Set the working directory in the container to /usr/src/app
WORKDIR /usr/src/app

# Step 3: Install git
RUN apt-get update && apt-get install -y git

# Step 4: Clone the repository
ARG GITHUB_REPO_URL
RUN git clone https://github.com/tibthink/cbt .

# Step 5: Change working directory to 'src' if it exists
WORKDIR /usr/src/app/src

# Step 6: Install any needed packages specified in package.json
# Note: This assumes package.json is located in the root of your repository.
# If it's inside the 'src' directory, move this step after setting the WORKDIR to 'src'
RUN npm install

# Step 7: Your app binds to port 3000 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3001

# Step 8: Define the command to run your app using CMD which defines your runtime
# Make sure to update the start command according to your application structure
CMD [ "node", "server.js" ]
