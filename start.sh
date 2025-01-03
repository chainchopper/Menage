#!/bin/bash

# Start MongoDB
mongod --dbpath ./data/db --logpath ./data/log/mongod.log --fork

# Start Redis
redis-server --daemonize yes

# Start the application
npm start
