const hre = require("hardhat");

async function main() {

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy('0x60f75Ef9cCEcE37907c2ea55f38AB109A9EcB18d', '0x9a4171FEE946425215f5D5DdAd3d4F59d94Afd9B', '0x55Bbf49dc52d5f7e501a652568F58d67389E6B44');

    await staking.deployed();

    console.log(
        `Staking contract deployed to ${staking.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});