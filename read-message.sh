#!/bin/bash

# Get the contract address from command line arguments or use a default
CONTRACT_ADDRESS=${1:-"0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6"}

# Print usage information if help flag is provided
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: ./read-message.sh [CONTRACT_ADDRESS]"
  echo ""
  echo "Reads the current message from a deployed HelloWorld smart contract on Arbitrum Sepolia."
  echo ""
  echo "Arguments:"
  echo "  CONTRACT_ADDRESS  The address of the deployed contract (default: 0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6)"
  echo ""
  echo "Example:"
  echo "  ./read-message.sh 0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6"
  exit 0
fi

# Export variables to be used by the script
export CONTRACT_ADDRESS="$CONTRACT_ADDRESS"

# Run the read-message script using the run-hardhat.sh script
./run-hardhat.sh run scripts/read-message.js --network arbitrumSepolia
