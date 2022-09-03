require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-etherscan');
require('dotenv').config();

const { API_URL, PRIVATE_KEY_1, API_KEY } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    bscTestnet: {
      url: API_URL,
      accounts: [PRIVATE_KEY_1]
    }
  },
  paths: {
    artifacts: "../frontend/src/utils/artifacts",
    cache: "../frontend/src/utils/cache"
  },
  etherscan: {
    apikey: {
      bscTestnet: API_KEY
    }
  }
};

// Token contract address = 0x60f75Ef9cCEcE37907c2ea55f38AB109A9EcB18d
// Staking contract address = 0xa8631959bfBCD9110e6B69fAcD0701c60b5D25A9