#!/bin/bash

# Function to show help menu
show_help() {
  echo "Usage: $0 [option]"
  echo "Options:"
  echo "  -u    Start the containers."
  echo "  -U    Start the containers detached."
  echo "  -s    Stop the containers."
  echo "  -r    Restart the containers."
  echo "  -t    Start a terminal for Node.js."
  echo "  -l    View logs for Node.js container."
  echo "  -h    Show this help menu."
  echo "If no option is provided, this help menu will be displayed."
}

# Function to start containers
start_containers() {
  echo "Starting containers..."
  docker-compose up
}

# Function to start containers detached
start_containers_detached() {
  echo "Starting containers detached..."
  docker-compose up -d
}

# Function to stop containers
stop_containers() {
  echo "Stopping containers..."
  docker-compose down
}

# Function to restart containers
restart_containers() {
  echo "Restarting containers..."
  docker-compose restart
}

# Function to start a terminal for Node.js
start_nodejs_terminal() {
  echo "Opening a Node.js terminal..."
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
}

# Function to view logs for Node.js
view_nodejs_logs() {
  echo "Viewing logs for Node.js container..."



#   SERVICE_NAME="cbt_nodejs_1"  # Replace with your actual service name

  docker logs -f cbt_nodejs_1
}

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run as root."
  exit 1
fi

# Check if no argument provided
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Process command-line options
while getopts "uUsrthl" opt; do
  case $opt in
    u)
      start_containers
      ;;
    U)
      start_containers_detached
      ;;
    s)
      stop_containers
      ;;
    r)
      restart_containers
      ;;
    t)
      start_nodejs_terminal
      ;;
    l)
      view_nodejs_logs
      ;;
    h)
      show_help
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      show_help
      exit 1
      ;;
  esac
done
