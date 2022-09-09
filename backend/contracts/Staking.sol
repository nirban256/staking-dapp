// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";

contract Staking is Pausable, ReentrancyGuard {
    Token token;

    using SafeMath for uint256;

    address public admin;
    address private rewardAddress;
    uint256 private totalSupply;

    struct Stakers {
        uint256 amount;
        uint256 startTime;
        bool claimed;
    }

    struct User {
        bool referred;
        address referred_by;
    }

    struct Referal_levels {
        uint256 level_1;
        uint256 level_2;
        uint256 level_3;
        uint256 level_4;
    }

    mapping(address => Referal_levels) public refer_info;

    // mappings for generating referral rewards
    mapping(address => User) public user_info;
    mapping(address => Stakers) public stakerBalances;

    address[] private stakersAddresses;

    event Staked(address indexed from, uint256 amount);
    event Claimed(address indexed from, uint256 amount);

    constructor(
        Token _tokenContract,
        address _rewardAddress,
        address _admin
    ) {
        token = _tokenContract;
        admin = _admin;
        rewardAddress = _rewardAddress;
        totalSupply = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "You don't have the required permission");
        _;
    }

    // function to get the total number of tokens staked in the contract
    function getTotalVolume() public view returns (uint256) {
        return totalSupply;
    }

    // function to get information about the stakers
    function getStakersBalances(address _account)
        public
        view
        onlyOwner
        returns (
            uint256,
            uint256,
            bool
        )
    {
        return (
            stakerBalances[_account].amount,
            stakerBalances[_account].startTime,
            stakerBalances[_account].claimed
        );
    }

    // function to stake tokens
    function stakeTokens(uint256 _amount) external payable whenNotPaused {
        require(_amount > 0, "Value must be greater than zero");
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient Balance");

        token.transferFrom(msg.sender, address(this), _amount);

        uint256 flag = 0;
        for (uint256 i = 0; i < stakersAddresses.length; i++) {
            if (stakersAddresses[i] == msg.sender) {
                stakerBalances[stakersAddresses[i]].amount += _amount;
                stakerBalances[stakersAddresses[i]].startTime = block.timestamp;
                stakerBalances[stakersAddresses[i]].claimed = false;
                flag++;
                break;
            }
        } // Error: staking again without claiming will get to receive the caller of the contract more interest on the tokens inspite being staked later due to startTime property.

        if (flag == 0) {
            stakerBalances[msg.sender] = Stakers({
                amount: _amount,
                startTime: block.timestamp,
                claimed: false
            });
            stakersAddresses.push(msg.sender);
        }

        totalSupply += _amount;

        emit Staked(msg.sender, _amount);
    }

    // function to calculate interest of the tokens
    function calculateInterest(address _account, uint256 _amount)
        internal
        view
        returns (uint256, uint256)
    {
        require(_account != address(0), "Owner cannot be the zero address");

        uint256 totalTokens = 0;
        uint256 comissionAmount = 0;
        if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 60 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 120
        ) {
            totalTokens = ((_amount * (2 * 10**18)) / 100);
            comissionAmount = 100 * 10**9 wei;
        }
        // day 2
        /*else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 172800 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 259200
        ) {
            totalTokens = ((_amount * 3) / 100);
            comissionAmount = 80 * 10**9 wei;
        }
        // day 3
        else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 259200 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 345600
        ) {
            totalTokens = ((_amount * 4) / 100);
            comissionAmount = 70 * 10**9 wei;
        }
        // day 4
        else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 345600 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 432000
        ) {
            totalTokens = ((_amount * 5) / 100);
            comissionAmount = 60 * 10**9 wei;
        }
        // day 5
        else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 432000 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 518400
        ) {
            totalTokens = ((_amount * 6) / 100);
            comissionAmount = 50 * 10**9 wei;
        }
        // day 6
        else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 518400 &&
            stakerBalances[_account].startTime + block.timestamp <
            stakerBalances[_account].startTime + 604800
        ) {
            totalTokens = ((_amount * 7) / 100);
            comissionAmount = 40 * 10**9 wei;
        }
        // day 7
        else if (
            stakerBalances[_account].startTime + block.timestamp >=
            stakerBalances[_account].startTime + 604800
        ) {
            totalTokens = ((_amount * 8) / 100);
            comissionAmount = 30 * 10**9 wei;
        }
        // day 0
        else if (
            stakerBalances[_account].startTime + block.timestamp <=
            stakerBalances[_account].startTime + 86400
        ) {
            totalTokens = _amount;
            comissionAmount = 25 * 10**9 wei;
        }*/

        totalTokens -= comissionAmount;

        return (totalTokens, comissionAmount);
    }

    // function to withdraw tokens along with rewards
    function withdrawTokens() external payable nonReentrant {
        require(msg.sender != address(0), "Address cannot be zero address");
        require(
            stakerBalances[msg.sender].claimed == false,
            "You have already claimed"
        );

        uint256 interestAmount = 0;
        uint256 comissionAmount = 0;
        (interestAmount, comissionAmount) = calculateInterest(
            msg.sender,
            stakerBalances[msg.sender].amount
        );
        stakerBalances[msg.sender].claimed = true;
        totalSupply -= stakerBalances[msg.sender].amount;

        token.transfer(
            msg.sender,
            stakerBalances[msg.sender].amount + interestAmount
        );
        stakerBalances[msg.sender].amount -= stakerBalances[msg.sender].amount;

        token.transfer(rewardAddress, comissionAmount);

        emit Claimed(address(this), stakerBalances[msg.sender].amount);
    }

    // function to get referral rewards
    function referee(address ref_add) public {
        require(user_info[msg.sender].referred == false, " Already referred ");
        require(ref_add != msg.sender, " You cannot refer yourself ");

        user_info[msg.sender].referred_by = ref_add;
        user_info[msg.sender].referred = true;

        address level1 = user_info[msg.sender].referred_by;
        address level2 = user_info[level1].referred_by;
        address level3 = user_info[level2].referred_by;
        address level4 = user_info[level3].referred_by;

        if ((level1 != msg.sender) && (level1 != address(0))) {
            refer_info[level1].level_1 += 1;
        }
        if ((level2 != msg.sender) && (level2 != address(0))) {
            refer_info[level2].level_2 += 1;
        }
        if ((level3 != msg.sender) && (level3 != address(0))) {
            refer_info[level3].level_3 += 1;
        }
        if ((level4 != msg.sender) && (level4 != address(0))) {
            refer_info[level4].level_4 += 1;
        }
    }

    // function to pause the contract in case of hacks
    function pause() external onlyOwner {
        _pause();
    }

    // function to unpause the contract after any issue which occurs gets resolved
    function unpause() external onlyOwner {
        _unpause();
    }
}
