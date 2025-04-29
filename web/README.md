# MetaMask Authentication Demo

This web application demonstrates how to implement authentication with MetaMask on the Arbitrum Sepolia testnet using the AuthenticatedHelloWorld smart contract.

## Features

- Connect to MetaMask
- Register a username on the blockchain
- Sign messages to authenticate
- Update the contract message
- View transaction history

## Setup

### Prerequisites

- [MetaMask](https://metamask.io/) browser extension installed
- Some Arbitrum Sepolia testnet ETH (for gas fees)

### Configure

1. Deploy the AuthenticatedHelloWorld contract:
   ```bash
   ./deploy-authenticated.sh
   ```

2. Copy the deployed contract address and update it in `app.js`:
   ```javascript
   const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   ```

### Run

To serve the web application locally using the included Express server:

```bash
# Navigate to the web directory
cd web

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

For development with auto-reload:
```bash
npm run dev
```

Then open your browser to http://localhost:3000.

## How It Works

### Authentication Flow

1. **Connect Wallet**: The user connects their MetaMask wallet to the application
2. **Registration**: If the user is not registered, they can register with a username
3. **Authentication**: 
   - The contract provides a nonce for the user
   - The user signs a message containing their address, the nonce, and the contract address
   - The signature is sent to the contract, which verifies it and increments the nonce
   - If the signature is valid, the user is authenticated

### Security Features

- **Nonce System**: Prevents replay attacks by using a one-time nonce for each authentication
- **Contract Address Binding**: Includes the contract address in the signed message to prevent cross-contract replay attacks
- **Signature Verification**: Validates that the signature was created by the user's private key

## Integration Guide

To integrate MetaMask authentication into your own application:

1. Include the contract functions for registration and authentication
2. Use the ethers.js library to handle signatures and contract interactions
3. Follow the signing pattern in the `authenticate()` function in app.js

## Testing

Make sure you're connected to Arbitrum Sepolia testnet in MetaMask. You may need to [add Arbitrum Sepolia to MetaMask](https://docs.arbitrum.io/build-decentralized-apps/how-to-guides/network-settings) if it's not already configured.
