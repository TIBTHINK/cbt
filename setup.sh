
#!/bin/bash

# Install Node.js and npm
curl -sL https://deb.nodesource.com/setup_14.x | bash -
apt-get install -y nodejs

# Install MySQL
apt-get install -y mysql-server

# Set up environment variables for time zone
echo "export TZ=YOUR_TIME_ZONE" >> ~/.bashrc
source ~/.bashrc

# Start MySQL service
service mysql start

# Add any additional setup steps here
node server.js

# Exit the script
exit 0
