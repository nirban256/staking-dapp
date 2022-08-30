const hre = require("hardhat");

async function main() {

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy('0x57219431E4272a080B60d6514571bEeCAC923337');

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