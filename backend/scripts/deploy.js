const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

  [signer1, signer2] = await ethers.getSigners();

  const Staking = await ethers.getContractFactory('Staking', signer1);

  const staking = await Staking.deploy('0x5FbDB2315678afecb367f032d93F642f64180aa3');

  await staking.deployed();

  console.log(`Staking contract deployed to ${staking.address}`);

  /* const provider = waffle.provider;
  let data;
  let transaction;
  let receipt;
  let block;
  let newUnlockDate;

  data = { value: ethers.utils.parseEther('10') }
  transaction = await staking.connect(signer2).stakePotato(1, data);

  data = { value: ethers.utils.parseEther('15') }
  transaction = await staking.connect(signer2).stakePotato(2, data);

  data = { value: ethers.utils.parseEther('12') }
  transaction = await staking.connect(signer2).stakePotato(2, data);

  data = { value: ethers.utils.parseEther('30') }
  transaction = await staking.connect(signer2).stakePotato(4, data);
  receipt = await transaction.wait();
  block = await provider.getBlock(receipt.blockNumber);
  newUnlockDate = block.timestamp - (60 * 60 * 24 * 1000);
  await staking.connect(signer1).changeUnlockPeriod(3, newUnlockDate);

  data = { value: ethers.utils.parseEther('12') }
  transaction = await staking.connect(signer2).stakePotato(7, data);
  receipt = await transaction.wait();
  block = await provider.getBlock(receipt.blockNumber);
  newUnlockDate = block.timestamp - (60 * 60 * 24 * 1000);
  await staking.connect(signer1).changeUnlockPeriod(4, newUnlockDate); */

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// Contract Address = 0x12163B070B97f06F5061D93164D960bbFCfdf965
// Bsc Testnet Address = 0xe39FBeE12491245b9ffEa2631Ee85a5f768fE385