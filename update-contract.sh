#!/bin/bash

# Get the contract address and new message from command line arguments
CONTRACT_ADDRESS=${1:-"0xd4fe0aDEf0a62398b629Da0620E079F0D487bBd2"}
NEW_MESSAGE=${2:-"Updated Hello World!"}

# Print usage information if help flag is provided
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
  echo "Usage: ./update-contract.sh [CONTRACT_ADDRESS] [NEW_MESSAGE]"
  echo ""
  echo "Updates the message in a deployed HelloWorld smart contract on Arbitrum Sepolia."
  echo ""
  echo "Arguments:"
  echo "  CONTRACT_ADDRESS  The address of the deployed contract (default: 0xd4fe0aDEf0a62398b629Da0620E079F0D487bBd2)"
  echo "  NEW_MESSAGE       The new message to set in the contract (default: 'Updated Hello World!')"
  echo ""
  echo "Example:"
  echo "  ./update-contract.sh 0xd4fe0aDEf0a62398b629Da0620E079F0D487bBd2 \"Hello from Arbitrum!\""
  exit 0
fi

# Export variables to be used by the script
export CONTRACT_ADDRESS="$CONTRACT_ADDRESS"
export NEW_MESSAGE="$NEW_MESSAGE"

# Run the update script using the run-hardhat.sh script
./run-hardhat.sh run scripts/update-contract.js --network arbitrumSepolia
