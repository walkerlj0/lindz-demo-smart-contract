git s#!/bin/bash

# Check if the contract address parameter is provided
if [ -z "$1" ]; then
  echo "Usage: ./update-web-contract-address.sh CONTRACT_ADDRESS"
  echo ""
  echo "Updates the web application's CONTRACT_ADDRESS with your deployed contract address."
  echo ""
  echo "Example:"
  echo "  ./update-web-contract-address.sh 0x123456789abcdef0123456789abcdef01234567"
  exit 1
fi

CONTRACT_ADDRESS=$1

# Validate the contract address format (should be 0x followed by 40 hex characters)
if [[ ! $CONTRACT_ADDRESS =~ ^0x[a-fA-F0-9]{40}$ ]]; then
  echo "Error: Invalid contract address format. It should start with 0x followed by 40 hexadecimal characters."
  exit 1
fi

# Path to the web app.js file
APP_JS_PATH="web/app.js"

# Check if the file exists
if [ ! -f "$APP_JS_PATH" ]; then
  echo "Error: $APP_JS_PATH not found!"
  exit 1
fi

# Update the CONTRACT_ADDRESS constant in the app.js file
sed -i '' "s|const CONTRACT_ADDRESS = \"0x[a-fA-F0-9]*\"|const CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\"|" $APP_JS_PATH

echo "✅ Updated web app with contract address: $CONTRACT_ADDRESS"
echo "You can now serve the web application to interact with your deployed contract."
echo ""
echo "To start the Node.js Express server:"
echo "cd web"
echo "npm install    # Only needed the first time"
echo "npm start"
echo ""
echo "Then open http://localhost:3000 in your browser."
