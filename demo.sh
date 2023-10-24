#!/bin/bash

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL and related packages
sudo apt install -y postgresql postgresql-contrib

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v

# unzip and remove artifacts .zip
sudo apt install unzip
unzip webapp
rm -rf webapp.zip

#remove artifacts
rm -rf artifacts

# install dependencies
cd webapp
npm install

# Remove git files
sudo apt-get remove -y git