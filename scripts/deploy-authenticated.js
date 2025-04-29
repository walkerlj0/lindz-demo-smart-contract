async function main() {
    // Get the contract factory for the AuthenticatedHelloWorld contract
    const AuthenticatedHelloWorld = await ethers.getContractFactory("AuthenticatedHelloWorld");
 
    // Deploy the contract with an initial message
    console.log("Deploying AuthenticatedHelloWorld contract...");
    const initialMessage = "Hello Authenticated World!";
    const authenticatedHelloWorld = await AuthenticatedHelloWorld.deploy(initialMessage);
    
    // Wait for deployment to complete
    console.log("Waiting for deployment to complete...");
    await authenticatedHelloWorld.deployed();
    
    // Log the contract address
    console.log("Contract deployed to address:", authenticatedHelloWorld.address);
    console.log("Initial message:", initialMessage);
    console.log("\nThis contract includes user authentication and registration features.");
    console.log("Users can register with a username and authenticate using MetaMask signatures.");
}
 
main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error(error);
     process.exit(1);
   });
