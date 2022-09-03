import React, { useEffect, useState } from "react";
import './App.css';
import logo3 from "./images/logo3.png";
import ficon1 from "./images/ficon1.png";
import ficon2 from "./images/ficon2.png";
import ficon3 from "./images/ficon3.png";
import stakingAbi from "./utils/artifacts/contracts/Staking.sol/Staking.json";
import tokenAbi from "./utils/artifacts/contracts/Token.sol/Token.json";
import { ethers } from "ethers";

const App = () => {

  const TokenContractAddress = "";
  const StakingContractAddress = "";

  const [currentAccount, setCurrentAccount] = useState(null);
  const [stakeContract, setStakeContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);

  const staking = async () => {
    const approve = await tokenContract.approve()
  }

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const tokensContract = new ethers.Contract(
        TokenContractAddress,
        tokenAbi.abi,
        signer
      );
      setTokenContract(tokensContract);

      const provider1 = new ethers.providers.Web3Provider(ethereum);
      const signers = provider1.getSigner();
      const stakingContract = new ethers.Contract(
        StakingContractAddress,
        stakingAbi.abi,
        signers
      );
      setStakeContract(stakingContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (!ethereum) {
          console.log('Make sure you have MetaMask!');
          return;
        } else {
          console.log('We have the ethereum object', ethereum);

          /*
           * Check if we're authorized to access the user's wallet
           */
          const accounts = await ethereum.request({ method: 'eth_accounts' });

          /*
           * User can have multiple authorized accounts, we grab the first one if its there!
           */
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log('Found an authorized account:', account);
            setCurrentAccount(account);
          } else {
            console.log('No authorized account found');
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkIfWalletIsConnected();

  }, [])

  return (
    <div className="container">
      <div className="row">
        <nav className="col-md-12">
          <button type="submit" className="btn-animate btn" onClick={connectWalletAction}>
            {currentAccount === null ? 'Connect' : `${currentAccount.slice(0, 4)}....${currentAccount.slice(38, 42)}`}
          </button>
        </nav>
      </div>

      <div className="row">
        <div className="col-md-12">
          <img src={logo3} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', marginBottom: '30px' }} alt="Baked Bread" />
        </div>

        <div className="col-md-12">
          <h4 style={{ textAlign: 'center', color: '#fff', marginBottom: '30px' }}>The BNB Reward Pool with the tastiest <br /> daily return and lowest dev fee</h4>
        </div>
      </div>

      <div className="frame">
        <div>
          <div className="row">
            <div className="col-md-6">
              <h4 className="colwh1">Contract</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 PTK</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Wallet</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 PTK</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Your Potatos</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 Potatos</h4>
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '35px', paddingTop: '18px', backgroundColor: '#4e4e0e', marginTop: '12px' }}>
            <div className="col-md-7">
              <input className="form-styling" type="text" name="username" placeholder="0" />
            </div>

            <div className="col-md-5">
              <h4 className="colwh3">PTK</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div type="submit" className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Bake Potatos</a> </div>
            </div>

            <div className="col-md-12">
              <hr className="hr1" />
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Your Rewards</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">0 PTK</h4>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div style={{ marginLeft: '32px' }} className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Re Bake</a> </div>
            </div>

            <div className="col-md-6">
              <div className="btn-animate"> <a href="#" rel="noreferrer" className="btn-signin">Eat Potatos</a> </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', height: '315px' }} className="frame">
        <div ng-app="true" ng-init="checked = false">
          <div className="row">
            <div className="col-md-12">
              <h4 className="colwh1">Nutrition Facts</h4>
            </div>

            <div className="col-md-12">
              <hr className="hr2" />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4 className="colwh1">Daily Return</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">8%</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">APR</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">2,920%</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh1">Dev Fee</h4>
            </div>

            <div className="col-md-6">
              <h4 className="colwh2">3%</h4>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '25px', height: '260px' }} className="frame">
        <div>
          <div className="row">
            <div className="col-md-12">
              <h4 className="colwh1">Referral Link</h4>
            </div>

            <div className="col-md-12">
              <hr className="hr2" />
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px', backgroundColor: '#4e4e0e' }}>
            <div className="col-md-12">
              <input className="form-styling" type="text" name="username" placeholder="" />
            </div>
          </div>

          <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px' }}>
            <div className="col-md-12">
              <h6 className="colwh4">Earn 12% of the PTK used to bake beans from anyone who uses your referral link</h6>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '18px' }}>
        <div className="col-md-5"></div>
        <div className="col-md-4">
          <img className="img-1" src={ficon1} alt="telegram" />

          <img className="img-2" src={ficon2} alt="BSC explorer" />

          <img className="img-3" src={ficon3} alt="twitter" />
        </div>
      </div>
    </div>
  )
}

export default App;
