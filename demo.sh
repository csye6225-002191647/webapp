#!/bin/bash

# export PGDATABASE=postgres
# export PGUSER=postgres 
# export PGPASSWORD=postgres 
# export PGPORT=5432 
# export PORT=3000
# export PGHOST=localhost

# echo $PGDATABASE
# echo $PGUSER
# echo $PGPASSWORD
# echo $PGPORT
# echo $PGHOST
# echo $PORT

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL and related packages
# sudo apt install -y postgresql postgresql-contrib
sudo apt-get install postgresql-client

# Start and enable PostgreSQL service
# sudo systemctl start postgresql
# sudo systemctl enable postgresql

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v

#user added
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

# unzip and remove artifacts .zip
sudo apt install unzip
sudo mkdir /opt/csye6225/webapp/
sudo mv /tmp/webapp.zip /opt/csye6225/
sudo unzip /opt/csye6225/webapp.zip -d /opt/csye6225/webapp
sudo rm -rf /opt/csye6225/webapp.zip

#remove artifacts
sudo rm -rf /opt/csye6225/webapp/artifacts

# install dependencies
cd /opt/csye6225/webapp
sudo npm install

# Setting up systemd
sudo touch /opt/csye6225/webapp/.env
sudo cp ./service/node.service /etc/systemd/system/node.service
sudo systemctl daemon-reload
sudo systemctl enable node.service
sudo systemctl start node.service
sudo systemctl restart node.service
# sudo systemctl stop node.service
journalctl -u node.service -b

# Remove git files
sudo apt-get remove -y git
