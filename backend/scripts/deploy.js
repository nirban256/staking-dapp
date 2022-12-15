const { ethers } = require("hardhat");

async function main() {

  const Staking = await ethers.getContractFactory('ChakraStaking');

  const staking = await Staking.deploy('0x9767ba8ece4fad70545a1c0544921070d9746271');

  await staking.deployed();

  console.log(`ChakraStaking contract deployed to ${staking.address}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Client token contract address - 0x9767ba8ece4fad70545a1c0544921070d9746271

// Staking Testnet Address = 0x972747df061D6adAc8b73C4889A53109688BF892

// In the staked function in ChakraStaking.sol the function should only count the amount staked if open is true.