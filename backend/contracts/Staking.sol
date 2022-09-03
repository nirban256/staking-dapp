// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";

contract Staking is Pausable, ReentrancyGuard {
    Token ptkToken;

    using SafeMath for uint256;
    using SafeMath for uint128;

    address public admin;

    uint256 public totalStakers;
    address public rewardAddress;

    struct StakeInfo {
        uint256 startTS;
        uint256 amount;
        uint256 claimed;
    }

    event Staked(address indexed from, uint256 amount);
    event Claimed(address indexed from, uint256 amount);

    mapping(address => StakeInfo) public stakeInfos;
    mapping(address => bool) public addressStaked;

    address[] public stakedAddresses;

    constructor(
        Token _tokenAddress,
        address _rewardAddress,
        address _admin
    ) {
        require(
            address(_tokenAddress) != address(0),
            "Token Address cannot be address 0"
        );
        ptkToken = _tokenAddress;
        totalStakers = 0;
        rewardAddress = _rewardAddress;
        admin = _admin;
    }

    modifier onlyOwner() {
        require(_msgSender() == admin, "You are not the admin");
        _;
    }

    // function to transfer tokens into the contract
    function transferToken(address _to, uint256 _amount) external onlyOwner {
        require(ptkToken.transfer(_to, _amount), "Token transfer failed!");
    }

    // function for claiming rewards
    function claimReward() external payable whenNotPaused returns (bool) {
        require(
            addressStaked[_msgSender()] == true,
            "You are not participated"
        );
        require(stakeInfos[_msgSender()].claimed == 0, "Already claimed");

        uint256 stakeAmount = stakeInfos[_msgSender()].amount;
        uint256 totalTokens;
        uint128 comissionAmount;

        // day 1
        if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 86400 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 172800
        ) {
            totalTokens = ((stakeAmount * 2) / 100);
            comissionAmount = 100 * 10**9 wei;
        }
        // day 2
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 172800 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 259200
        ) {
            totalTokens = ((stakeAmount * 3) / 100);
            comissionAmount = 80 * 10**9 wei;
        }
        // day 3
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 259200 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 345600
        ) {
            totalTokens = ((stakeAmount * 4) / 100);
            comissionAmount = 70 * 10**9 wei;
        }
        // day 4
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 345600 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 432000
        ) {
            totalTokens = ((stakeAmount * 5) / 100);
            comissionAmount = 60 * 10**9 wei;
        }
        // day 5
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 432000 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 518400
        ) {
            totalTokens = ((stakeAmount * 6) / 100);
            comissionAmount = 50 * 10**9 wei;
        }
        // day 6
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 518400 &&
            stakeInfos[_msgSender()].startTS + block.timestamp <
            stakeInfos[_msgSender()].startTS + 604800
        ) {
            totalTokens = ((stakeAmount * 7) / 100);
            comissionAmount = 40 * 10**9 wei;
        }
        // day 7
        else if (
            stakeInfos[_msgSender()].startTS + block.timestamp >=
            stakeInfos[_msgSender()].startTS + 604800
        ) {
            totalTokens = ((stakeAmount * 8) / 100);
            comissionAmount = 30 * 10**9 wei;
        } else {
            totalTokens = stakeAmount;
            comissionAmount = 25 * 10**9 wei;
        }

        totalTokens -= comissionAmount;

        stakeInfos[_msgSender()].claimed = totalTokens;
        payable(address(this)).transfer(totalTokens);
        payable(rewardAddress).transfer(comissionAmount);

        emit Claimed(_msgSender(), totalTokens);
        addressStaked[_msgSender()] = false;

        return true;
    }

    // Function for staking tokens
    function stakeToken(uint256 _stakeAmount) external payable whenNotPaused {
        require(_stakeAmount > 0, "Stake amount should be correct");
        require(
            addressStaked[_msgSender()] == false,
            "You already participated"
        );
        require(
            ptkToken.balanceOf(_msgSender()) >= _stakeAmount,
            "Insufficient Balance"
        );

        ptkToken.transferFrom(_msgSender(), address(this), _stakeAmount);
        uint256 flag = 0;
        for (uint256 i = 0; i < stakedAddresses.length; i++) {
            if (stakedAddresses[i] == _msgSender()) {
                flag++;
            }
        }
        if (flag == 0) {
            totalStakers++;
            stakedAddresses.push(_msgSender());
        }
        addressStaked[_msgSender()] = true;

        stakeInfos[_msgSender()] = StakeInfo({
            startTS: block.timestamp,
            amount: _stakeAmount,
            claimed: 0
        });

        emit Staked(_msgSender(), _stakeAmount);
    }

    // function for pausing the contract in case of hacks
    function pause() external onlyOwner {
        _pause();
    }

    // function to unpause the contract
    function unpause() external onlyOwner {
        _unpause();
    }
}
