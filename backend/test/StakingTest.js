const { expect } = require("chai");

describe('Staking', () => {
  beforeEach(async () => {
    [signer1, signer2] = await ethers.getSigners();

    Staking = await ethers.getContractFactory('Staking', signer1);

    staking = await Staking.deploy({
      value: ethers.utils.parseEther('10')
    });
  })

  describe('deploy', () => {
    it('should set owner', async () => {
      expect(await staking.admin()).to.equal(signer1.address);
    })

    it('should set levels and lock periods', async () => {
      expect(await staking.lockPeriods(0)).to.equal(1);
      expect(await staking.lockPeriods(1)).to.equal(2);
      expect(await staking.lockPeriods(2)).to.equal(3);

      expect(await staking.levels(1)).to.equal(200);
      expect(await staking.levels(2)).to.equal(300);
      expect(await staking.levels(3)).to.equal(400);
    })

    it('should check contract balance after deployment', async () => {
      const provider = waffle.provider;
      expect(await provider.getBalance(staking.address)).to.equal(ethers.utils.parseEther('10'));
    })
  })

  describe('stake ether', () => {
    it('should transfer ether', async () => {
      const provider = waffle.provider;

      let contractBalance;
      let signerBalance
      const amount = ethers.utils.parseEther('2.0');

      contractBalance = await provider.getBalance(staking.address);
      signerBalance = await signer1.getBalance()
      const data = { value: amount };

      const transaction = await staking.connect(signer1).stakeMatic(1, data);
      const recepient = await transaction.wait();
      const gasUsed = recepient.gasUsed.mul(recepient.effectiveGasPrice);

      expect(await signer1.getBalance()).to.equal(signerBalance.sub(amount).sub(gasUsed));

      expect(await provider.getBalance(staking.address)).to.equal(contractBalance.add(amount));
    })
  })
})