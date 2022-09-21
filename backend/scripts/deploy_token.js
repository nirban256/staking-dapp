const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {

    const Token = await ethers.getContractFactory('Token');

    const token = await Token.deploy();

    await token.deployed();

    console.log(`Token contract deployed to ${token.address}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// 0x5FbDB2315678afecb367f032d93F642f64180aa3