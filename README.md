# Smart Contract Demo on Arbitrum Sepolia

A simple HelloWorld smart contract demonstration deployed on Arbitrum Sepolia testnet.

## Project Overview

This project contains a simple HelloWorld smart contract that stores a message which can be updated. The contract is deployed on the Arbitrum Sepolia testnet.

## Features

- HelloWorld smart contract with message storage and update functionality
- Deployment script for Arbitrum Sepolia
- Update script to modify the message in the deployed contract
- Balance checking utility

## Prerequisites

- Node.js v18.20.4 (recommended, managed via nvm)
- npm or yarn
- An Ethereum wallet with some Arbitrum Sepolia testnet ETH

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` with your own API URL and private key:
   ```
   API_URL = "YOUR_ALCHEMY_API_URL"
   PRIVATE_KEY = "YOUR_WALLET_PRIVATE_KEY"
   ```
   Note: Never commit your actual `.env` file to version control!

## Usage

### Deploy the Contract

```bash
./run-hardhat.sh run scripts/deploy.js --network arbitrumSepolia
```

### Update the Contract Message

```bash
./update-contract.sh <CONTRACT_ADDRESS> "Your new message"
```

### Check Wallet Balance

```bash
./run-hardhat.sh run scripts/check-balance.js --network arbitrumSepolia
```

## Security Notes

- Always use a dedicated development wallet with minimal funds for testing
- Never use your main wallet's private key in development environments
- Keep your `.env` file secure and never commit it to version control

## License

[MIT](LICENSE)
