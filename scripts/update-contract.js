// Script to update the message in the deployed HelloWorld contract
async function main() {
  // Get the contract address from command line arguments or use a default
  const contractAddress = process.argv[2] || "0xd4fe0aDEf0a62398b629Da0620E079F0D487bBd2";
  
  // Get the new message from command line arguments or use a default
  const newMessage = process.argv[3] || "Updated Hello World!";
  
  console.log(`Updating contract at address ${contractAddress} with message: "${newMessage}"`);
  
  // Get the contract factory
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  
  // Connect to the deployed contract
  const helloWorldContract = await HelloWorld.attach(contractAddress);
  
  // Call the update function
  console.log("Sending transaction...");
  const tx = await helloWorldContract.update(newMessage);
  
  // Wait for the transaction to be mined
  console.log("Waiting for transaction to be mined...");
  await tx.wait();
  
  console.log("Contract updated successfully!");
  
  // Read the updated message to verify
  const updatedMessage = await helloWorldContract.message();
  console.log(`New message: "${updatedMessage}"`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error updating contract:", error);
    process.exit(1);
  });
