// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AuthenticatedHelloWorld
 * @dev A contract that extends the HelloWorld functionality with user authentication
 */
contract AuthenticatedHelloWorld {
    // Events
    event UpdatedMessages(string oldStr, string newStr);
    event UserRegistered(address indexed user, string username);
    event UserAuthenticated(address indexed user, uint256 timestamp);
    event NonceUpdated(address indexed user, uint256 nonce);

    // Mapping to track registered users
    mapping(address => bool) public registeredUsers;
    
    // Mapping to store usernames
    mapping(address => string) public usernames;
    
    // Mapping to store nonces for each user (used for preventing replay attacks)
    mapping(address => uint256) public nonces;
    
    // Declares a state variable `message` of type `string`.
    string public message;

    /**
     * @dev Constructor sets the initial message
     * @param initMessage The initial message to store
     */
    constructor(string memory initMessage) {
        message = initMessage;
    }

    /**
     * @dev Updates the message stored in the contract
     * @param newMessage The new message to store
     */
    function update(string memory newMessage) public {
        string memory oldMsg = message;
        message = newMessage;
        emit UpdatedMessages(oldMsg, newMessage);
    }

    /**
     * @dev Registers a new user
     * @param username The username to associate with the caller's address
     */
    function registerUser(string memory username) public {
        require(!registeredUsers[msg.sender], "User already registered");
        require(bytes(username).length > 0, "Username cannot be empty");
        
        registeredUsers[msg.sender] = true;
        usernames[msg.sender] = username;
        nonces[msg.sender] = 0;
        
        emit UserRegistered(msg.sender, username);
    }

    /**
     * @dev Gets the current nonce for a user
     * @param user The address of the user
     * @return The current nonce
     */
    function getNonce(address user) public view returns (uint256) {
        return nonces[user];
    }

    /**
     * @dev Authenticates a user based on a signed message
     * @param signature The signature produced by signing the messageHash
     */
    function authenticate(bytes memory signature) public {
        // Recreate the message hash that was signed
        bytes32 messageHash = keccak256(abi.encodePacked(
            "\x19Ethereum Signed Message:\n32",
            keccak256(abi.encodePacked(msg.sender, nonces[msg.sender], address(this)))
        ));
        
        // Recover the signer from the signature
        address signer = recoverSigner(messageHash, signature);
        
        // Ensure the signer is the caller
        require(signer == msg.sender, "Invalid signature");
        require(registeredUsers[msg.sender], "User not registered");
        
        // Increment the nonce to prevent replay attacks
        nonces[msg.sender]++;
        
        emit UserAuthenticated(msg.sender, block.timestamp);
        emit NonceUpdated(msg.sender, nonces[msg.sender]);
    }

    /**
     * @dev Recovers the signer address from a signature
     * @param messageHash The hash of the original message
     * @param signature The signature to verify
     * @return The address of the signer
     */
    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        // Extract r, s, v from the signature
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        
        // Version of signature should be 27 or 28, but some implementations use 0 or 1
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "Invalid signature 'v' value");
        
        // ecrecover precompile to recover the signer address
        return ecrecover(messageHash, v, r, s);
    }

    /**
     * @dev Checks if a user is registered
     * @param user The address to check
     * @return Boolean indicating if the user is registered
     */
    function isRegistered(address user) public view returns (bool) {
        return registeredUsers[user];
    }

    /**
     * @dev Gets the username for a user
     * @param user The address of the user
     * @return The username associated with the address
     */
    function getUserName(address user) public view returns (string memory) {
        require(registeredUsers[user], "User not registered");
        return usernames[user];
    }
}
