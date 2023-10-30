#!/bin/bash

# Define the container name based on service name in docker-compose.yml
CONTAINER_NAME="cbt_nodejs_1"

# Check if the container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    # If running, exec into the container
    docker exec -it $CONTAINER_NAME /bin/sh
else
    # If not running, print a message
    echo "The container $CONTAINER_NAME is not running."
    echo "Do you want to start it? (yes/no)"

    read response

    if [ "$response" = "yes" ]; then
        docker-compose up -d $CONTAINER_NAME
        docker exec -it $CONTAINER_NAME /bin/sh
    else
        echo "Exiting..."
    fi
fi