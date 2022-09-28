require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const { API_URL, PRIVATE_KEY_1, PRIVATE_KEY_2, API_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.8.9",
      },
    ],
  },
  paths: {
    artifacts: "../frontend/src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    matic: {
      url: API_URL,
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2]
    },
    bscTestnet: {
      url: API_URL,
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2]
    }
  },
  etherscan: {
    apiKey: API_KEY
  }
};
