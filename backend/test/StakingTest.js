const { expect } = require("chai");
const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const { deployFixture } = require("./deployStakingFixture");

describe('ChakraStaking', async () => {
  describe('Token contract', () => {
    it('should set the totalSupply to new owner\'s balance', async () => {
      const { signer1, token } = await loadFixture(deployFixture);

      const ownerBalance = await token.balanceOf(signer1.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  })

  describe('ChakraStake Contract', () => {
    it('should check the admin', async () => {
      const { chakra } = await loadFixture(deployFixture);

      const admin = await chakra.admin;
      expect(await chakra.admin).to.equal(admin);
    });

    it('should stake tokens', async () => {
      const { signer1, token, chakra } = await loadFixture(deployFixture);

      await token.connect(signer1).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer1.address, chakra.address)).to.be.equal(2000000000000000000n);

      const depositorIdBefore = await chakra.depositorId();
      await chakra.connect(signer1).stakeChakra(2000000000000000000n);
      const depositorIdAfter = await chakra.depositorId();
      expect(depositorIdAfter).to.above(depositorIdBefore);

      const { amountStaked, staker } = await chakra.stakers(depositorIdAfter);
      expect(amountStaked).to.be.equal(2000000000000000000n);
      expect(staker).to.equal(signer1.address);
    });

    it('should emit stake event', async () => {
      const { signer1, token, chakra } = await loadFixture(deployFixture);

      await token.connect(signer1).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer1.address, chakra.address)).to.be.equal(2000000000000000000n);

      expect(await chakra.connect(signer1).stakeChakra(2000000000000000000n)).to.emit(chakra, "Staked").withArgs(signer1.address, 2000000000000000000n);
    });

    it('should get total amount staked and total balance in the chakra contract', async () => {
      const { signer1, token, chakra } = await loadFixture(deployFixture);

      await token.connect(signer1).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer1.address, chakra.address)).to.be.equal(2000000000000000000n);

      await token.connect(signer1).transfer(chakra.address, 2000000000000000000n);

      await chakra.connect(signer1).stakeChakra(2000000000000000000n);
      expect(await chakra.totalStakedAmount()).to.be.equal(2000000000000000000n);

      expect(await chakra.getTotalVolume()).to.equal(4000000000000000000n);
    });

    it('should calculate amount earned by the staker', async () => {
      const { signer1, token, chakra } = await loadFixture(deployFixture);

      await token.connect(signer1).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer1.address, chakra.address)).to.be.equal(2000000000000000000n);

      await chakra.connect(signer1).stakeChakra(2000000000000000000n);
      await time.increase(500);
      const amount = await chakra.connect(signer1).amountEarned(signer1.address);
      expect(amount).to.be.equal(2200000000000000000n);
    });

    it('should emit Withdraw event', async () => {
      const { signer1, token, chakra } = await loadFixture(deployFixture);

      await token.connect(signer1).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer1.address, chakra.address)).to.be.equal(2000000000000000000n);

      await token.connect(signer1).transfer(chakra.address, 2000000000000000000n)

      await chakra.connect(signer1).stakeChakra(2000000000000000000n);
      await time.increase(500);

      expect(await chakra.connect(signer1).withdrawChakra()).to.emit(chakra, "Withdraw").withArgs(signer1.address, 2200000000000000000n);
    });

    it('should check how much token the staker receives', async () => {
      const { signer1, token, chakra, signer2 } = await loadFixture(deployFixture);

      await token.connect(signer1).transfer(chakra.address, 2000000000000000000n);
      await token.connect(signer1).transfer(signer2.address, 5000000000000000000n);

      await token.connect(signer2).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer2.address, chakra.address)).to.be.equal(2000000000000000000n);

      await chakra.connect(signer2).stakeChakra(2000000000000000000n);
      const amountBefore = await token.balanceOf(signer2.address);
      await time.increase(130);

      await chakra.connect(signer2).withdrawChakra();
      const amountAfter = await token.balanceOf(signer2.address);
      expect(amountAfter).to.be.gt(amountBefore);
    });

    it('should check admin receives the comission', async () => {
      const { signer1, token, chakra, signer2 } = await loadFixture(deployFixture);

      await token.connect(signer1).transfer(chakra.address, 2000000000000000000n);
      await token.connect(signer1).transfer(signer2.address, 5000000000000000000n);

      await token.connect(signer2).approve(chakra.address, 2000000000000000000n);
      expect(await token.allowance(signer2.address, chakra.address)).to.be.equal(2000000000000000000n);

      const amountBefore = await token.balanceOf(signer1.address);

      await chakra.connect(signer2).stakeChakra(2000000000000000000n);
      await time.increase(130);

      await chakra.connect(signer2).withdrawChakra();
      const amountAfter = await token.balanceOf(signer1.address);

      expect(amountAfter).to.be.gt(amountBefore);
    });

    it('should receive 0 tokens after withdraw', async () => {
      const { token, chakra, signer2 } = await loadFixture(deployFixture);

      await chakra.connect(signer2).withdrawChakra();
      expect(await token.balanceOf(signer2.address)).to.be.equal(0);
    });
  })
})