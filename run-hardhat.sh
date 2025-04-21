#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 18.20.4
nvm use 18.20.4

# Run Hardhat command with arguments
npx hardhat "$@"
