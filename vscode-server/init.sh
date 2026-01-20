#!/bin/bash

pkill -f "npx nodemon vscode-server/server.js" || true
sleep 1

echo "" >> vscode-server/server.log

nohup npx nodemon --delay 1000ms vscode-server/server.js >> vscode-server/server.log 2>&1 &

echo "Server started in background. Logs: vscode-server/server.log"
