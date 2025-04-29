// Script to read the message from a deployed HelloWorld contract
async function main() {
  // Get the contract address from command line arguments or use a default
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x82b7896234Dcc5A4256657D1A9efa5879D8e5Ff6";
  
  console.log(`Reading message from contract at address ${contractAddress}`);
  
  // Get the contract factory
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  
  // Connect to the deployed contract
  const helloWorldContract = await HelloWorld.attach(contractAddress);
  
  // Read the message
  const message = await helloWorldContract.message();
  console.log(`Current message: "${message}"`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error reading contract:", error);
    process.exit(1);
  });
