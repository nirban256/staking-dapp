require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { API_URL, PRIVATE_KEY_1 } = process.env;

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {},
    testnet: {
      url: API_URL,
      accounts: [PRIVATE_KEY_1]
    }
  },
};

// Token contract address = 0x57219431E4272a080B60d6514571bEeCAC923337