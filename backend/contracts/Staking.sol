// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Token.sol";

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
    Stakers staker;

    uint256 private totalStakers = 0;

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
    mapping(address => User) public user_info;

    mapping(uint256 => Stakers) public stakers;
    mapping(address => uint256[]) public stakerIdsByAddress;
    mapping(uint256 => uint256) public levels;

    uint256[] public lockPeriods;

    constructor(Token _address) {
        admin = msg.sender;
        token = _address;

        levels[2] = 300; // 3%
        levels[4] = 600; // 6%
        levels[7] = 1000; // 10%

        lockPeriods.push(2);
        lockPeriods.push(4);
        lockPeriods.push(7);
    }

    modifier onlyOwner() {
        require(admin == msg.sender, "Only owner can change it");
        _;
    }

    function stakePotato(uint256 _amount) external whenNotPaused {
        require(msg.sender != address(0), "Address cannot be 0 address");
        require(_amount >= 0, "Value must be greater than 0");

        token.transferFrom(msg.sender, address(this), _amount);

        stakers[totalStakers] = Stakers(
            totalStakers,
            msg.sender,
            block.timestamp,
            _amount,
            true
        );

        stakerIdsByAddress[msg.sender].push(totalStakers);
        totalStakers++;
    }

    function getTotalVolume() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function calculateInterest(uint256 _id, uint256 _amount)
        private
        view
        returns (uint256)
    {
        uint256 totalTimeStaked = (block.timestamp - stakers[_id].dateCreated) /
            60 /
            60 /
            24;
        uint256 interest = 0;

        for (uint256 i = 0; i <= lockPeriods.length - 1; i++) {
            if (i + 1 > lockPeriods.length - 1) {
                interest = levels[7];
            }
            if (
                totalTimeStaked >= lockPeriods[i] &&
                totalTimeStaked < lockPeriods[i + 1]
            ) {
                interest = levels[i];
            }
        }

        return (interest * _amount) / 10000;
    }

    function getInterestRate(uint256 _id) external view returns (uint256) {
        uint256 ans = 0;
        uint256 totalTimeStaked = (block.timestamp - stakers[_id].dateCreated) /
            60 /
            60 /
            24;
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

        uint256 commissionAmount = 100 wei;

        uint256 interest = calculateInterest(_id, stakers[_id].amountStaked);
        stakers[_id].open = false;

        interest -= commissionAmount;

        token.transfer(msg.sender, stakers[_id].amountStaked + interest);
        token.transfer(admin, commissionAmount);

        //payable(msg.sender).transfer(stakers[_id].amountStaked + interest);
    }

    function referral(address ref_add) public {
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

    function pause() external onlyOwner {
        _pause();
    }

    // function to unpause the contract after any issue which occurs gets resolved
    function unpause() external onlyOwner {
        _unpause();
    }
}
