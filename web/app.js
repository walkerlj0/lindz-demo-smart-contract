// Contract ABI - This needs to be replaced with your deployed contract's ABI
const CONTRACT_ABI = [
    // Message functions
    "function message() view returns (string)",
    "function update(string newMessage)",
    
    // Authentication functions
    "function registerUser(string username)",
    "function isRegistered(address user) view returns (bool)",
    "function getUserName(address user) view returns (string)",
    "function getNonce(address user) view returns (uint256)",
    "function authenticate(bytes signature)",
    
    // Events
    "event UpdatedMessages(string oldStr, string newStr)",
    "event UserRegistered(address indexed user, string username)",
    "event UserAuthenticated(address indexed user, uint256 timestamp)",
    "event NonceUpdated(address indexed user, uint256 nonce)"
];

// Update this after deployment
const CONTRACT_ADDRESS = "0x86475277CE05B5E217E695FA585468219905F864"; // Replace with your deployed contract address
const CHAIN_ID = 421614; // Arbitrum Sepolia Chain ID

// Main app
document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const connectButton = document.getElementById('connectButton');
    const connectionStatus = document.getElementById('connectionStatus');
    const userActions = document.getElementById('userActions');
    const userAddress = document.getElementById('userAddress');
    const userBalance = document.getElementById('userBalance');
    const registrationSection = document.getElementById('registrationSection');
    const registeredSection = document.getElementById('registeredSection');
    const usernameInput = document.getElementById('usernameInput');
    const registerButton = document.getElementById('registerButton');
    const registrationStatus = document.getElementById('registrationStatus');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const contractMessage = document.getElementById('contractMessage');
    const newMessageInput = document.getElementById('newMessageInput');
    const updateMessageButton = document.getElementById('updateMessageButton');
    const updateStatus = document.getElementById('updateStatus');
    const authenticateButton = document.getElementById('authenticateButton');
    const authenticationStatus = document.getElementById('authenticationStatus');
    const currentNonce = document.getElementById('currentNonce');
    const transactionHistory = document.getElementById('transactionHistory');
    const contractAddressElement = document.getElementById('contractAddress');
    
    // Set contract address
    contractAddressElement.textContent = CONTRACT_ADDRESS;
    
    // App state
    let provider;
    let signer;
    let contract;
    let userAccount;
    let transactionCount = 0;
    
    // Initialize app
    const initApp = async () => {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            connectionStatus.innerHTML = `
                <div class="alert alert-danger">
                    MetaMask is not installed. Please install MetaMask to use this app.
                    <a href="https://metamask.io/download.html" target="_blank" class="alert-link">Download MetaMask</a>
                </div>
            `;
            connectButton.disabled = true;
            return;
        }
        
        // Set up event listeners
        connectButton.addEventListener('click', connectWallet);
        registerButton.addEventListener('click', registerUser);
        updateMessageButton.addEventListener('click', updateMessage);
        authenticateButton.addEventListener('click', authenticate);
        
        // Check if already connected
        if (window.ethereum.selectedAddress) {
            await connectWallet();
        }
    };
    
    // Connect to MetaMask
    const connectWallet = async () => {
        try {
            connectionStatus.innerHTML = '<div class="alert alert-info">Connecting to MetaMask...</div>';
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            // Check if we're on the right network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (parseInt(chainId, 16) !== CHAIN_ID) {
                try {
                    // Try to switch to Arbitrum Sepolia
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }], // Arbitrum Sepolia
                    });
                } catch (switchError) {
                    // If the network doesn't exist in MetaMask, we need to add it
                    if (switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [{
                                    chainId: `0x${CHAIN_ID.toString(16)}`,
                                    chainName: 'Arbitrum Sepolia',
                                    nativeCurrency: {
                                        name: 'ETH',
                                        symbol: 'ETH',
                                        decimals: 18
                                    },
                                    rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                                    blockExplorerUrls: ['https://sepolia.arbiscan.io/']
                                }]
                            });
                        } catch (addError) {
                            connectionStatus.innerHTML = `<div class="alert alert-danger">Failed to add Arbitrum Sepolia network to MetaMask: ${addError.message}</div>`;
                            return;
                        }
                    } else {
                        connectionStatus.innerHTML = `<div class="alert alert-danger">Failed to switch to Arbitrum Sepolia network: ${switchError.message}</div>`;
                        return;
                    }
                }
            }
            
            // Set up ethers
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            
            // Update UI
            connectionStatus.innerHTML = `<div class="alert alert-success">Connected to MetaMask!</div>`;
            userActions.style.display = 'block';
            userAddress.textContent = userAccount;
            
            // Get and display balance
            const balance = await provider.getBalance(userAccount);
            userBalance.textContent = ethers.utils.formatEther(balance);
            
            // Check if user is registered
            const isRegistered = await contract.isRegistered(userAccount);
            if (isRegistered) {
                // User is registered, show the registered section
                registrationSection.style.display = 'none';
                registeredSection.style.display = 'block';
                
                // Get username and message
                const username = await contract.getUserName(userAccount);
                const message = await contract.message();
                const nonce = await contract.getNonce(userAccount);
                
                usernameDisplay.textContent = username;
                contractMessage.textContent = message;
                currentNonce.textContent = nonce.toString();
                
                // Listen for events
                setupEventListeners();
            } else {
                // User is not registered, show registration section
                registrationSection.style.display = 'block';
                registeredSection.style.display = 'none';
            }
            
            // Set up event listeners for MetaMask
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', () => window.location.reload());
            
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            connectionStatus.innerHTML = `<div class="alert alert-danger">Failed to connect: ${error.message}</div>`;
        }
    };
    
    // Handle account changes
    const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
            // User disconnected their wallet
            connectionStatus.innerHTML = '<div class="alert alert-warning">Wallet disconnected. Please connect again.</div>';
            userActions.style.display = 'none';
            connectButton.disabled = false;
        } else if (accounts[0] !== userAccount) {
            // User switched accounts
            userAccount = accounts[0];
            userAddress.textContent = userAccount;
            
            // Get and display balance
            const balance = await provider.getBalance(userAccount);
            userBalance.textContent = ethers.utils.formatEther(balance);
            
            // Check if the new account is registered
            const isRegistered = await contract.isRegistered(userAccount);
            if (isRegistered) {
                registrationSection.style.display = 'none';
                registeredSection.style.display = 'block';
                
                // Get username and message
                const username = await contract.getUserName(userAccount);
                const message = await contract.message();
                const nonce = await contract.getNonce(userAccount);
                
                usernameDisplay.textContent = username;
                contractMessage.textContent = message;
                currentNonce.textContent = nonce.toString();
            } else {
                registrationSection.style.display = 'block';
                registeredSection.style.display = 'none';
            }
        }
    };
    
    // Register a new user
    const registerUser = async () => {
        const username = usernameInput.value.trim();
        if (!username) {
            registrationStatus.innerHTML = '<div class="alert alert-danger">Please enter a username</div>';
            return;
        }
        
        try {
            registrationStatus.innerHTML = '<div class="alert alert-info">Registering user...</div>';
            
            // Show transaction modal
            const transactionModal = new bootstrap.Modal(document.getElementById('transactionModal'));
            transactionModal.show();
            document.getElementById('modalMessage').textContent = 'Please confirm the registration transaction in MetaMask...';
            
            // Send transaction
            const tx = await contract.registerUser(username);
            
            // Update modal message
            document.getElementById('modalMessage').textContent = 'Transaction submitted. Waiting for confirmation...';
            
            // Wait for transaction to be mined
            await tx.wait();
            
            // Close modal
            transactionModal.hide();
            
            // Update UI
            registrationStatus.innerHTML = '<div class="alert alert-success">Registration successful!</div>';
            registrationSection.style.display = 'none';
            registeredSection.style.display = 'block';
            
            usernameDisplay.textContent = username;
            
            // Get current message and nonce
            const message = await contract.message();
            const nonce = await contract.getNonce(userAccount);
            
            contractMessage.textContent = message;
            currentNonce.textContent = nonce.toString();
            
            // Add to transaction history
            addTransactionToHistory('Registration', tx.hash);
            
            // Set up event listeners
            setupEventListeners();
            
        } catch (error) {
            console.error('Error registering user:', error);
            registrationStatus.innerHTML = `<div class="alert alert-danger">Registration failed: ${error.message}</div>`;
            
            // Close modal if open
            const transactionModal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
            if (transactionModal) {
                transactionModal.hide();
            }
        }
    };
    
    // Update contract message
    const updateMessage = async () => {
        const newMessage = newMessageInput.value.trim();
        if (!newMessage) {
            updateStatus.innerHTML = '<div class="alert alert-danger">Please enter a message</div>';
            return;
        }
        
        try {
            updateStatus.innerHTML = '<div class="alert alert-info">Updating message...</div>';
            
            // Show transaction modal
            const transactionModal = new bootstrap.Modal(document.getElementById('transactionModal'));
            transactionModal.show();
            document.getElementById('modalMessage').textContent = 'Please confirm the update transaction in MetaMask...';
            
            // Send transaction
            const tx = await contract.update(newMessage);
            
            // Update modal message
            document.getElementById('modalMessage').textContent = 'Transaction submitted. Waiting for confirmation...';
            
            // Wait for transaction to be mined
            await tx.wait();
            
            // Close modal
            transactionModal.hide();
            
            // Update UI
            updateStatus.innerHTML = '<div class="alert alert-success">Message updated successfully!</div>';
            contractMessage.textContent = newMessage;
            newMessageInput.value = '';
            
            // Add to transaction history
            addTransactionToHistory('Update Message', tx.hash);
            
        } catch (error) {
            console.error('Error updating message:', error);
            updateStatus.innerHTML = `<div class="alert alert-danger">Update failed: ${error.message}</div>`;
            
            // Close modal if open
            const transactionModal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
            if (transactionModal) {
                transactionModal.hide();
            }
        }
    };
    
    // Authenticate with signature
    const authenticate = async () => {
        try {
            authenticationStatus.innerHTML = '<div class="alert alert-info">Preparing authentication...</div>';
            
            // Get the current nonce
            const nonce = await contract.getNonce(userAccount);
            
            // Create message hash
            const messageHash = ethers.utils.keccak256(
                ethers.utils.solidityPack(
                    ['address', 'uint256', 'address'],
                    [userAccount, nonce, CONTRACT_ADDRESS]
                )
            );
            
            authenticationStatus.innerHTML = '<div class="alert alert-info">Please sign the message in MetaMask...</div>';
            
            // Request signature from user
            const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));
            
            // Show transaction modal
            const transactionModal = new bootstrap.Modal(document.getElementById('transactionModal'));
            transactionModal.show();
            document.getElementById('modalMessage').textContent = 'Please confirm the authentication transaction in MetaMask...';
            
            // Send transaction with signature
            const tx = await contract.authenticate(signature);
            
            // Update modal message
            document.getElementById('modalMessage').textContent = 'Transaction submitted. Waiting for confirmation...';
            
            // Wait for transaction to be mined
            await tx.wait();
            
            // Close modal
            transactionModal.hide();
            
            // Update UI
            authenticationStatus.innerHTML = '<div class="alert alert-success">Authentication successful!</div>';
            
            // Update nonce
            const newNonce = await contract.getNonce(userAccount);
            currentNonce.textContent = newNonce.toString();
            
            // Add to transaction history
            addTransactionToHistory('Authentication', tx.hash);
            
        } catch (error) {
            console.error('Error authenticating:', error);
            authenticationStatus.innerHTML = `<div class="alert alert-danger">Authentication failed: ${error.message}</div>`;
            
            // Close modal if open
            const transactionModal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
            if (transactionModal) {
                transactionModal.hide();
            }
        }
    };
    
    // Set up event listeners for contract events
    const setupEventListeners = () => {
        // Listen for message updates
        contract.on('UpdatedMessages', (oldMsg, newMsg, event) => {
            // Only update if it's a new event (not from the initial subscription)
            if (event.blockNumber > 0) {
                contractMessage.textContent = newMsg;
                updateStatus.innerHTML = '<div class="alert alert-success">Message updated!</div>';
            }
        });
        
        // Listen for user registration
        contract.on('UserRegistered', (user, username, event) => {
            // Only update if it's for the current user and a new event
            if (user.toLowerCase() === userAccount.toLowerCase() && event.blockNumber > 0) {
                usernameDisplay.textContent = username;
                registrationStatus.innerHTML = '<div class="alert alert-success">Registration confirmed!</div>';
            }
        });
        
        // Listen for authentication events
        contract.on('UserAuthenticated', (user, timestamp, event) => {
            // Only update if it's for the current user and a new event
            if (user.toLowerCase() === userAccount.toLowerCase() && event.blockNumber > 0) {
                const date = new Date(timestamp.toNumber() * 1000);
                authenticationStatus.innerHTML = `<div class="alert alert-success">Authentication confirmed at ${date.toLocaleString()}!</div>`;
            }
        });
        
        // Listen for nonce updates
        contract.on('NonceUpdated', (user, newNonce, event) => {
            // Only update if it's for the current user and a new event
            if (user.toLowerCase() === userAccount.toLowerCase() && event.blockNumber > 0) {
                currentNonce.textContent = newNonce.toString();
            }
        });
    };
    
    // Add transaction to history
    const addTransactionToHistory = (type, hash) => {
        transactionCount++;
        
        // Clear initial message if this is the first transaction
        if (transactionCount === 1) {
            transactionHistory.innerHTML = '';
        }
        
        // Create transaction element
        const txElement = document.createElement('div');
        txElement.className = 'mb-3 p-2 border rounded';
        txElement.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <strong>${type}</strong>
                <small class="text-muted">${new Date().toLocaleString()}</small>
            </div>
            <div class="mt-1">
                <a href="https://sepolia.arbiscan.io/tx/${hash}" target="_blank" class="text-break">
                    ${hash}
                </a>
            </div>
        `;
        
        // Add to history
        transactionHistory.prepend(txElement);
    };
    
    // Initialize the app
    initApp();
});
