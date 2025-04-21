const { ethers } = require("hardhat");

async function main() {
  const { PRIVATE_KEY } = process.env;
  
  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(PRIVATE_KEY, ethers.provider);
  
  // Get the wallet address
  const address = wallet.address;
  
  // Get the balance
  const balance = await ethers.provider.getBalance(address);
  
  console.log("Wallet Address:", address);
  console.log("Network:", network.name);
  console.log("Balance:", ethers.utils.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
