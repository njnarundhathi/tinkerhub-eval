#!/bin/bash
export PATH="/Users/aru/local/bin:$PATH"

echo "Starting Eval Platform..."
echo "  Frontend → http://localhost:4000"
echo "  Backend  → http://localhost:4001"
echo ""

# Start server in background
node server/index.js &
SERVER_PID=$!

# Start client
cd client && node_modules/.bin/vite

# On exit, kill server
kill $SERVER_PID 2>/dev/null
