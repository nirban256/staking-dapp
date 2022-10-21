// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// interface Token {
//     function transfer(address recipient, uint256 amount)
//         external
//         returns (bool);

//     function balanceOf(address account) external view returns (uint256);

//     function transferFrom(
//         address sender,
//         address recipient,
//         uint256 amount
//     ) external returns (uint256);
// }

// client token interface
interface Token {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);
}

contract Staking is Pausable, ReentrancyGuard {
    Token token;

    address public admin;

    struct Stakers {
        uint256 stakerId;
        address stakerAddress;
        uint256 dateCreated;
        uint256 amountStaked;
        bool open;
    }
    // Stakers staker;

    uint256 private totalStakers = 0;
    uint256 public totalStakedAmount;

    mapping(address => bool) internal referral_info;

    mapping(uint256 => Stakers) public stakers;
    mapping(address => uint256[]) public stakerIdsByAddress;
    mapping(uint256 => uint256) public levels;

    uint256[] public lockPeriods;

    event Staked(address _staker, uint256 _amount);
    event Withdraw(
        address _withdrawer,
        uint256 _amount,
        uint256 _interestEarned
    );

    constructor(Token _address) {
        admin = msg.sender;
        token = _address;

        levels[2] = 300; // 3%
        levels[4] = 600; // 6%
        levels[7] = 1000; // 10%

        lockPeriods.push(2);
        lockPeriods.push(4);
        lockPeriods.push(7);

        totalStakedAmount = 0;
    }

    modifier onlyOwner() {
        require(admin == msg.sender, "Only owner can change it");
        _;
    }

    function stakePotato(uint256 _amount) external whenNotPaused {
        require(msg.sender != address(0), "Address cannot be 0 address");
        require(_amount >= 0 wei, "Value must be greater than 0");

        token.transferFrom(msg.sender, address(this), _amount);
        // bool success = token.call(
        //     abi.encodeWithSignature(
        //         "transferFrom(address,address,uint256)",
        //         msg.sender,
        //         address(this),
        //         _amount
        //     )
        // );

        stakers[totalStakers] = Stakers(
            totalStakers,
            msg.sender,
            block.timestamp,
            _amount,
            true
        );

        stakerIdsByAddress[msg.sender].push(totalStakers);
        totalStakers++;

        totalStakedAmount += _amount;

        emit Staked(msg.sender, stakers[totalStakers - 1].amountStaked);
    }

    function getTotalVolume() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function totalAmountStaked() external view returns (uint256) {
        return totalStakedAmount;
    }

    function calculateInterest(uint256 _id, uint256 _amount)
        private
        view
        returns (uint256)
    {
        uint256 totalTimeStaked = (block.timestamp - stakers[_id].dateCreated) /
            60 minutes /
            24 hours;
        uint256 interest = 0;

        for (uint256 i = 0; i <= lockPeriods.length - 1; i++) {
            if (i + 1 > lockPeriods.length - 1) {
                interest = levels[7];
            }
            if (
                totalTimeStaked >= lockPeriods[i] &&
                totalTimeStaked < lockPeriods[i + 1]
            ) {
                interest = levels[lockPeriods[i]];
            }
        }

        return (interest * _amount) / 10000;
    }

    function getInterestRate(uint256 _id) external view returns (uint256) {
        uint256 ans = 0;
        uint256 totalTimeStaked = (block.timestamp - stakers[_id].dateCreated) /
            60 minutes /
            24 hours;
        for (uint256 i = 0; i < lockPeriods.length - 1; i++) {
            if (
                i == lockPeriods.length - 1 && totalTimeStaked > lockPeriods[i]
            ) {
                ans = levels[i];
            }
            if (
                totalTimeStaked >= lockPeriods[i] &&
                totalTimeStaked < lockPeriods[i + 1]
            ) {
                ans = levels[i];
            }
        }
        return ans;
    }

    function updateStakePeriod(uint256 _numOfDays, uint256 _interest)
        external
        onlyOwner
    {
        levels[_numOfDays] = _interest;
        lockPeriods.push(_numOfDays);
    }

    function getStakersById(uint256 _stakerId)
        external
        view
        returns (Stakers memory)
    {
        return stakers[_stakerId];
    }

    function getStakeperiods()
        external
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return lockPeriods;
    }

    function getStakerIdsByAddresses(address _address)
        external
        view
        returns (uint256[] memory)
    {
        return stakerIdsByAddress[_address];
    }

    function withdrawPotato(uint256 _id) external nonReentrant {
        require(
            stakers[_id].stakerAddress == msg.sender,
            "You are not the staker"
        );
        require(stakers[_id].open == true, "Potato already withdrawn");

        unchecked {
            uint256 commissionAmount = 100 wei;

            uint256 interest = calculateInterest(
                _id,
                stakers[_id].amountStaked
            );
            stakers[_id].open = false;

            stakers[_id].amountStaked -= commissionAmount;
            token.transfer(msg.sender, stakers[_id].amountStaked + interest);
            token.transfer(admin, commissionAmount);

            emit Withdraw(
                msg.sender,
                stakers[_id].amountStaked + interest,
                interest
            );
        }

        // payable(msg.sender).transfer(stakers[_id].amountStaked + interest);
    }

    function pause() external onlyOwner {
        _pause();
    }

    // function to unpause the contract after any issue which occurs gets resolved
    function unpause() external onlyOwner {
        _unpause();
    }
}
