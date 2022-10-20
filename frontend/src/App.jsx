import React, { useState, useEffect } from "react";
import stakingArtifact from "./artifacts/contracts/Staking.sol/Staking.json";
import tokenArtifact from "./artifacts/contracts/Token.sol/Token.json";
import { ethers } from "ethers";
import './App.css';
import Navbar from "./components/Navbar";
import StakeModal from "./components/StakeModal";
import bnbLogo from "./images/binance-coin-logo.svg";

// const ContractAddress = '0x12163B070B97f06F5061D93164D960bbFCfdf965';
const StakingContractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const TokenContractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const App = () => {

  // frontend states
  const [provider, setProvider] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [tokenContract, setTokenContract] = useState(undefined);
  const [stakingContract, setStakingContract] = useState(undefined);
  const [accountAddress, setAccountAddress] = useState(undefined);

  // assets
  const [assetId, setAssetId] = useState([]);
  const [assets, setAssets] = useState([]);

  // staking
  const [stakeModal, setStakeModal] = useState(false);
  const [rewards, setRewards] = useState(0);
  // const [stakingPercent, setStakingPercent] = useState('');
  const [amount, setAmount] = useState(0);
  const [approve, setApprove] = useState(false);

  // functions
  const toWei = ether => ethers.utils.parseEther(ether);
  const toPotato = wei => ethers.utils.formatEther(wei);

  useEffect(() => {
    const onload = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const tokensContract = new ethers.Contract(
        TokenContractAddress,
        tokenArtifact.abi
      )
      setTokenContract(tokensContract);

      const stakeContract = new ethers.Contract(
        StakingContractAddress,
        stakingArtifact.abi
      )
      setStakingContract(stakeContract);
    }

    // const getTotalStaked = async () => {
    //   let staked = await stakingContract.totalAmountStaked();
    //   setAmount(toPotato(staked));
    // }

    // const remainingRewards = async () => {
    //   let reward = await stakingContract.getTotalVolume();
    //   setRewards(toPotato(reward));
    // }

    onload();
    // getTotalStaked();
    // remainingRewards();
  }, [])

  const isConnected = () => account !== undefined;

  const getAssetIds = async (address, account) => {
    const assetIds = await stakingContract.connect(account).getStakerIdsByAddresses(address);

    return assetIds;
  }

  const getAssets = async (ids, account) => {
    const loopedAssets = await Promise.all(
      ids.map(id => stakingContract.connect(account).getStakersById(id))
    )

    loopedAssets.map(async asset => {
      const parsedAsset = {
        stakersId: asset.stakerId,
        amountStaked: toPotato(asset.amountStaked),
        open: asset.open
      }

      setAssets(prev => prev.amountStaked + parsedAsset.amountStaked);
    })
  }

  const getAccount = async () => {
    await provider.send("eth_requestAccounts", [])

    const account = provider.getSigner()
    return account;
  }

  const connectAndLoadWallet = async () => {
    const account = await getAccount(provider)
    setAccount(account);

    const accountAddress = await account.getAddress();
    setAccountAddress(accountAddress);

    const assetIds = await getAssetIds(accountAddress, account);
    setAssetId(assetIds);

    getAssets(assetIds, account);
  }

  const stake = async (amount) => {
    const wei = toWei(amount);

    await stakingContract.connect(account).stakePotato(wei);
  }


  const stakingModal = () => {
    setStakeModal(true);
  }

  const withdraw = (stakersId) => {
    stakingContract.connect(account).withdrawPotato(stakersId);
  }

  const getApproval = async (amount) => {
    const wei = toWei(amount);
    const approve = await tokenContract.connect(account).approve(StakingContractAddress, wei);
    if (approve) {
      setApprove(true);
    }
    else {
      setApprove(false);
    }
  }

  return (
    <div>
      <div>
        <Navbar isConnected={isConnected} connect={connectAndLoadWallet} />
      </div>

      <div className="flex-auto block">
        <div className="max-w-6xl pt-8 md:pt-16 pb-60 px-3 md:px-8 mt-0 mb-0 ml-auto mr-auto relative">
          <h1 className=" text-[#666] block text-2xl mb-8">
            STAKING
          </h1>

          <div className=" grid gap-y-4 md:gap-y-8 md:grid-cols-2">
            <div className=" bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md block overflow-hidden px-6 py-4 w-full">
              <span className="text-[#666] mb-4">Total Staked</span>
              <h2>768,147</h2>
            </div>

            <div>
              <span className="text-[#666] mb-2">Remaining rewards</span>
              <h2>132,017</h2>
            </div>
          </div>

          {approve === true ?
            (
              <div onClick={() => stakingModal()}>
                <button type="submit" className="orangeButton">
                  Stake Chakra
                </button>
              </div>
            )
            :
            (
              <span>
                Approve the tokens for staking
              </span>
            )
          }

          {approve === false ?
            (
              <div>
                <button onClick={() => getApproval(amount)}>
                  Approve Chakra
                </button>
              </div>
            )
            :
            (
              <p>''</p>
            )
          }

          {stakeModal && (
            <StakeModal onClose={() => setStakeModal(false)} amount={amount} setAmount={setAmount} stake={stake} />
          )}
        </div>
      </div>

      {/* <div className="appBody">
        <div className="marketContainer">
          <div className="subContainer">
            <span>
              <img src={bnbLogo} alt="matic logo" className="logoImg" />
            </span>

            <span className="marketHeader">BNB Market</span>
          </div>

          <div>
            <div className="row">
              <div className="fieldContainer">
                <input type="number" className='inputField' placeholder="0" onChange={e => setAmount(e.target.value)} />
              </div>
            </div>

            <div className="row">
              <button onClick={() => getApproval(amount)} className="orangeButton">
                Approve Chakra
              </button>
            </div>
          </div>

          {approve === true ? (
            <div onClick={() => stakingModal()} className="marketOption">
              <button type="submit" className="orangeButton">
                Stake Chakra
              </button>
            </div>
          )
            :
            (
              <span style={{ color: "white", marginTop: '36px' }}>
                First approve the tokens to be staked
              </span>
            )}
        </div>
      </div>

      <div className="assetContainer">
        <div className="subContainer">
          <span className="marketHeader">Staked Assets</span>
        </div>

        <div>
          <div className="row columnHeaders">
            <div className="col-md-3">Assets</div>
            <div className="col-md-3">Staked</div>
            <div className="col-md-3">Interest earned</div>
            <div className="col-md-3"></div>
          </div>
        </div>
        <br />

        {assets.length > 0 && assets.map((asset, index) => (
          <div className="row">
            <div className="col-md-3">
              <span>
                <img src={bnbLogo} alt="bnb-logo" className="stakedLogoImg" />
              </span>
            </div>

            <div className="col-md-3">
              {asset.amountStaked}
            </div>
            <div className="col-md-3">
              {asset.amountInterest}
            </div>
            <div className="col-md-3">
              {asset.open ? (
                <div className="orangeMiniButton" onClick={() => withdraw(asset.stakersId)}>
                  Withdraw
                </div>
              ) : (
                <span>Closed</span>
              )}
            </div>
          </div>
        ))}

      </div>

      <div className="referral_container">
        <h2 className="referral_heading">Insert your referral link</h2>

        <form className="referral_input">
          <input type="text" placeholder="Enter your referral id" onChange={e => setReferralId(e.target.value)} />
          <button className="referralButton" onSubmit={referral}>Submit</button>
        </form>

        <h3 className="referral_heading">
          {(accountAddress) ? `Your referral id - ${accountAddress}` : ''}
        </h3>
      </div>

      {stakeModal && (
        <StakeModal onClose={() => setStakeModal(false)} amount={amount} setAmount={setAmount} stake={stake} />
      )} */}

    </div>
  );
}

export default App;
