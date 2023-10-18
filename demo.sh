#!/bin/bash

export PGDATABASE=postgres
export PGUSER=postgres 
export PGPASSWORD=postgres 
export PGPORT=5432 
export PORT=3000
export PGHOST=localhost

echo $PGDATABASE
echo $PGUSER
echo $PGPASSWORD
echo $PGPORT
echo $PGHOST
echo $PORT

# Update and upgrade packages
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL and related packages
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Node.js and npm
sudo apt install -y nodejs
sudo apt install -y npm

# Check Node.js version
nodejs -v

# Configure PostgreSQL: set password, create database, and create user
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE USER apurvazawar WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "CREATE DATABASE apurvazawar;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE "apurvazawar" to apurvazawar;"

# unzip and install dependencies
sudo apt install unzip
pwd
ls
unzip webapp
cd webapp
ls
npm install
