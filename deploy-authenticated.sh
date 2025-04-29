#!/bin/bash

# Print information about the script
echo "Deploying AuthenticatedHelloWorld contract to Arbitrum Sepolia..."
echo "This contract includes user authentication and registration features."

# Load NVM and use the right Node version
source $HOME/.nvm/nvm.sh
nvm use 18.20.4

# Run the deployment script using Hardhat
./run-hardhat.sh run scripts/deploy-authenticated.js --network arbitrumSepolia
