import React, { useState, useEffect } from "react";
import stakingArtifact from "./artifacts/contracts/ChakraStaking.sol/ChakraStaking.json";
import tokenArtifact from "./artifacts/contracts/ChakraStaking.sol/Token.json";
import { ethers } from "ethers";
import './App.css';
import Navbar from "./components/Navbar";
import bnbLogo from "./images/binance-coin-logo.svg";

const StakingContractAddress = '0xcE8c414Bc9B64121C1a6C9c0F9342Fe05A068c7C';
const TokenContractAddress = '0x9767ba8ece4fad70545a1c0544921070d9746271';

const App = () => {

  // frontend states
  const [provider, setProvider] = useState(undefined);
  const [account, setAccount] = useState();
  const [tokenContract, setTokenContract] = useState(undefined);
  const [stakingContract, setStakingContract] = useState(undefined);
  const [accountAddress, setAccountAddress] = useState(undefined);

  const [rewards, setRewards] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [approve, setApprove] = useState(false);

  // functions
  const toWei = ether => ethers.utils.parseEther(ether);
  const toChakra = wei => ethers.utils.formatEther(wei);

  useEffect(() => {
    const onload = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const tokenContract = new ethers.Contract(
        TokenContractAddress,
        tokenArtifact,
        provider
      )
      setTokenContract(tokenContract);

      const stakeContract = new ethers.Contract(
        StakingContractAddress,
        stakingArtifact.abi,
        provider
      )
      setStakingContract(stakeContract);
      totalStaked();
      rewardsLeft();
    }

    onload();
  }, [])

  const isConnected = () => account !== undefined;

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
  }

  const stake = async (amount) => {
    const wei = toWei(amount);
    await stakingContract.connect(account).stakeChakra(wei);
  }

  const withdraw = async () => {
    const contract = new ethers.Contract(StakingContractAddress, stakingArtifact.abi, account);
    await contract.connect(account).withdrawChakra();
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

  const rewardsLeft = async () => {
    let reward;
    reward = toChakra(await stakingContract.connect(account).getTotalVolume());
    setRewards(reward);
  }

  const totalStaked = async () => {
    let totalAsset;
    totalAsset = await stakingContract.connect(account).amountEarned(accountAddress);
    setStakedAmount(toChakra(totalAsset));
  }

  return (
    <div>
      <Navbar isConnected={isConnected} connect={connectAndLoadWallet} />

      <main className="flex-auto block mx-4">
        <div className="max-w-6xl pt-8 md:pt-12 pb-16 md:pb-8 px-3 md:px-8 mt-0 mb-0 ml-auto mr-auto relative">
          <h1 className=" text-[#666] block text-2xl md:text-3xl mb-8">
            STAKING
          </h1>

          <div className=" grid gap-y-4 md:gap-y-8 md:gap-x-6 md:grid-cols-2">
            <div className=" bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md block overflow-hidden px-4 py-4 w-full">
              <span className="text-[#666] mb-4">Total Staked</span>
              <h2 className=" flex flex-row items-center">
                768,147
                <img src={bnbLogo} className=" w-7 h-7 ml-2" alt="" />
              </h2>
            </div>

            <div className="bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md block overflow-hidden px-6 py-4 w-full">
              <span className="text-[#666] mb-2">Remaining rewards</span>
              <h2 className=" flex flex-row items-center">
                132,017
                <img src={bnbLogo} className=" w-7 h-7 ml-2" alt="" />
              </h2>
            </div>
          </div>

          <div className=" grid gap-4 md:gap-8 md:grid-cols-3 grid-rows-3 md:grid-rows-2 mt-4 md:mt-8">
            <div className="bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md block px-6 py-4 w-full">
              <span className="pb-6">Withdraw Tokens</span>
              <h3 className=" flex flex-row items-center">
                <button className="bg-gradient-to-r from-[#4f6cff] to-[#bb29f7] hover:from-[#bb29f7] hover:to-[#4f6cff] px-4 py-2 font-semibold rounded-3xl text-sm md:text-xl md:px-2 border-none outline-none text-white" type="submit" onClick={withdraw}>Withdraw</button>
              </h3>
            </div>

            <div className="bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md block overflow-hidden px-6 py-4 w-full">
              <span>Reward</span>
              <h3 className=" flex flex-row items-center">
                {rewards > 0 ? rewards : 0}
                <img src={bnbLogo} className=" w-5 h-5 ml-2" alt="" />
              </h3>
            </div>

            <div className=" flex justify-center items-center flex-col md:col-start-2 md:col-end-4 row-start-1 row-end-3 px-6 py-4 bg-white border-b-[1px] border-solid border-[#e6e6e6] rounded-md">
              {approve === true ?
                (
                  <span className=" text-2xl font-semibold mb-6">
                    Stake Chakra
                  </span>
                )
                :
                (
                  <span className=" text-2xl font-semibold">
                    Approve Chakra for staking
                  </span>
                )
              }

              {approve === false ?
                (
                  <div className="grow flex items-center justify-center flex-col">
                    <input type="number" placeholder="0" tabIndex={0} className=" mb-3 px-4 py-2 md:px-8 md:py-3 rounded-lg outline-none bg-[#e2e8f0a2] w-52 md:w-96" onChange={e => setAmount(e.target.value)} />

                    <button className="text-white bg-gradient-to-r from-[#4f6cff] to-[#bb29f7] hover:from-[#bb29f7] hover:to-[#4f6cff] px-4 py-2 font-semibold rounded-3xl text-sm md:text-xl md:px-2 border-none outline-none mt-1 md:mt-3" onClick={() => getApproval(amount)}>
                      Approve Chakra
                    </button>
                  </div>
                )
                :
                (
                  <div>
                    <div onClick={async (e) => { e.stopPropagation() }}>
                      <div className=" text-center">
                        <div>
                          <div className="flex flex-row items-center">
                            <input readOnly className="mb-3 px-4 py-2 md:px-8 md:py-3 rounded-lg outline-none bg-[#e2e8f0a2] w-52 sm:w-96 md:w-96" value={amount} />
                            <img src={bnbLogo} className="w-7 h-7 ml-2 mb-3" alt="" />
                          </div>
                        </div>

                        <button type="submit" className=" text-white bg-gradient-to-r from-[#4f6cff] to-[#bb29f7] hover:from-[#bb29f7] hover:to-[#4f6cff] px-4 py-2 font-semibold rounded-3xl text-sm md:text-xl md:px-2 border-none outline-none mt-1 md:mt-3" onClick={() => stake(amount)}>
                          Stake Potato
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App;
