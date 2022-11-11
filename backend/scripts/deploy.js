const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

  // [signer1, signer2] = await ethers.getSigners();

  const Staking = await ethers.getContractFactory('Staking');

  const staking = await Staking.deploy('0x9767ba8ece4fad70545a1c0544921070d9746271');

  await staking.deployed();

  console.log(`Staking contract deployed to ${staking.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Client token contract address - 0x9767ba8ece4fad70545a1c0544921070d9746271

// Staking Testnet Address = 0xbBD6998Ac87a394de02Af7a7dA978D2fcb4cB05f