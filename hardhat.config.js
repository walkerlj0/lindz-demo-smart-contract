/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;
// Remove '0x' prefix if it exists
const privateKey = PRIVATE_KEY.startsWith('0x') ? PRIVATE_KEY.substring(2) : PRIVATE_KEY;

module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "arbitrumSepolia",
  networks: {
      hardhat: {},
      arbitrumSepolia: {
         url: "https://sepolia-rollup.arbitrum.io/rpc",
         accounts: [`0x${privateKey}`],
         chainId: 421614
      }
  },
  mocha: {
    timeout: 40000
  },
  ignoreNodeVersion: true
}