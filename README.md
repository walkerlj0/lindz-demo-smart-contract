# Smart Contract Demo on Arbitrum Sepolia

A simple smart contract demonstration deployed on Arbitrum Sepolia testnet.

## Project Overview

This project contains a simple smart contract that is deployed on the Arbitrum Sepolia testnet.

### Explore Smart Contracts
See the various deployments on https://sepolia.arbiscan.io/
Creator Wallet Address: 0xdb4Bf427b1546c462EF83620e2d2AaF8c781c5eB

#### Contracts
* 0xd4fe0aDEf0a62398b629Da0620E079F0D487bBd2
* 0x7675DA30Bcc226DFC4bbCE43bCAA441C88934d73
* 0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6

View contracts at (https://sepolia.arbiscan.io/address/0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6)[https://sepolia.arbiscan.io/address/0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6]

## Features

- HelloWorld smart contract with message storage and update functionality
- Deployment scripts for Arbitrum Sepolia
- Update scripts to modify the message in the deployed contract
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

## MetaMask Authentication for Smart Contracts on Arbitrum Sepolia

Users are able to sign up and authenticate with MetaMask on Arbitrum Sepolia. The project includes:

### 1. Enhanced Smart Contract

`AuthenticatedHelloWorld.sol` extends the original HelloWorld contract with:
- User registration with usernames
- MetaMask signature-based authentication
- Nonce system to prevent replay attacks
- Events for tracking authentication activities

### 2. Deployment Tools

- `scripts/deploy-authenticated.js`: Hardhat deployment script for the new contract
- `deploy-authenticated.sh`: Bash script to easily deploy the contract to Arbitrum Sepolia

### 3. Web Application

See the `/web` directory for a complete web application with:
- Connect with MetaMask
- Register with a username
- Authenticate using cryptographic signatures
- Update and view the contract message
- Transaction history tracking

### How to Use MetaMask Authentication

1. **Deploy the Contract**
   ```bash
   ./deploy-authenticated.sh
   ```
   This will deploy the AuthenticatedHelloWorld contract to Arbitrum Sepolia and provide you with the contract address.

2. **Update the Web App**
   ```bash
   ./update-web-contract-address.sh YOUR_CONTRACT_ADDRESS
   ```
   This will update the web application with your deployed contract address.

3. **Serve the Web Application**
   ```bash
   cd web
   npm install
   npm start
   ```
   Then open http://localhost:3000 in your browser to interact with your contract.

4. **Authenticate with MetaMask**
   - Connect your MetaMask wallet to the application
   - Register with a username
   - Authenticate by signing a message with your wallet
   - Update the contract message and perform other actions

This implementation provides a secure, blockchain-based authentication system that leverages the cryptographic capabilities of MetaMask without requiring users to share their private keys or pay for gas on every login (only registration and initial authentication require gas).



## Security Notes

- Always use a dedicated development wallet with minimal funds for testing
- Never use your main wallet's private key in development environments
- Keep your `.env` file secure and never commit it to version control

## License

[MIT](LICENSE)
