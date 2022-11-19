var deployFixture = async function () {
    const [signer1, signer2, signer3] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token", signer1);
    const token = await Token.deploy();

    const Chakra = await ethers.getContractFactory("ChakraStaking", signer1);
    const chakra = await Chakra.deploy(token.address);

    return { signer1, signer2, signer3, token, chakra };
}

module.exports = {
    deployFixture: deployFixture
}