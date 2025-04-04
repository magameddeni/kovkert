#!/bin/bash
# start.sh

# Replace runtime env vars and start next server
bash /app/scripts/replace-variable.sh && 
node /app/server.js
