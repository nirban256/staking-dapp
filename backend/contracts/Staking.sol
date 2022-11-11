// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// client token interface
// interface Token {
//     function transferFrom(
//         address from,
//         address to,
//         uint256 amount
//     ) external returns (bool);

//     function balanceOf(address account) external view returns (uint256);

//     function transfer(address to, uint256 amount) external returns (bool);
// }

import "./Token.sol";

contract Staking is Pausable, ReentrancyGuard {
    Token token;

    address public admin;
    uint256 totalAmountStaked;
    uint256 stakerId;

    struct Stakers {
        address staker;
        uint256 stakerId;
        uint256 dateCreated;
        uint256 amountStaked;
        bool claimed;
    }

    mapping(uint256 => Stakers) public stakers;
    mapping(address => uint256[]) public stakerIdsByAddress;
    mapping(uint256 => uint256) public levels;

    uint256[] public lockPeriods;

    event Staked(address _staker, uint256 _amount);
    event Withdraw(address _withdrawer, uint256 _amount);

    constructor(Token _address) {
        admin = msg.sender;
        token = _address;

        levels[2] = 300; // 3%
        levels[4] = 600; // 6%
        levels[7] = 1000; // 10%

        lockPeriods.push(2);
        lockPeriods.push(4);
        lockPeriods.push(7);

        totalAmountStaked = 0;
        stakerId = 0;
    }

    receive() external payable {
        revert("No known transaction");
    }

    function stakeChakra(uint256 _amount) external {
        require(msg.sender != address(0), "Address cannot be the zero address");
        require(_amount >= 1 ether, "Value must be greater than 0");

        token.transferFrom(msg.sender, address(this), _amount);
        stakerId += 1;
        stakers[stakerId] = Stakers(
            msg.sender,
            stakerId,
            block.timestamp,
            _amount,
            false
        );

        stakerIdsByAddress[msg.sender].push(stakerId);
        totalAmountStaked += _amount;

        emit Staked(msg.sender, stakers[stakerId].amountStaked);
    }

    function calculateInterest(uint256 _amount, uint256 _stakerId)
        private
        view
        returns (uint256)
    {
        uint256 totalTimeStaked = (block.timestamp -
            stakers[_stakerId].dateCreated) /
            60 /
            60 /
            24;
        uint256 interest = 0;

        for (uint256 i = 0; i <= lockPeriods.length - 1; i++) {
            if (
                totalTimeStaked >= lockPeriods[i] &&
                totalTimeStaked < lockPeriods[i + 1]
            ) {
                interest = levels[lockPeriods[i]];
            }

            if (i + 1 > lockPeriods.length - 1) {
                interest = levels[7];
            }
        }

        return (interest * _amount) / 10000;
    }

    function getInterestRate(uint256 _stakerId)
        external
        view
        returns (uint256)
    {
        uint256 ans = 0;
        uint256 totalTimeStaked = (block.timestamp -
            stakers[_stakerId].dateCreated) /
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

    function getStakeperiods()
        external
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return lockPeriods;
    }

    function getStakerIdsByAddresses(address _address)
        internal
        view
        returns (uint256[] memory)
    {
        return stakerIdsByAddress[_address];
    }

    function amountEarned(address _staker)
        external
        view
        returns (uint256 amount)
    {
        uint256[] memory stakersIds = getStakerIdsByAddresses(_staker);
        for (uint256 i; i < stakersIds.length; ) {
            amount =
                amount +
                (stakers[stakersIds[i]].amountStaked +
                    calculateInterest(
                        stakers[stakersIds[i]].amountStaked,
                        stakersIds[i]
                    ));
            unchecked {
                ++i;
            }
        }
        return amount;
    }

    function withdrawPotato() external nonReentrant {
        address staker = msg.sender;
        uint256 amount;
        uint256 comission = 0;

        unchecked {
            uint256[] memory stakersIds = getStakerIdsByAddresses(staker);

            for (uint256 i; i < stakersIds.length; ++i) {
                if (stakers[stakersIds[i]].claimed == false) {
                    amount =
                        amount +
                        (stakers[stakersIds[i]].amountStaked +
                            calculateInterest(
                                stakers[stakersIds[i]].amountStaked,
                                stakersIds[i]
                            ));
                    amount = amount - 100 wei;
                    comission += 100 wei;
                    stakers[stakersIds[i]].claimed = true;
                }
            }
            token.transfer(msg.sender, amount);
            token.transfer(admin, comission);
        }

        emit Withdraw(staker, amount);

        // payable(msg.sender).transfer(stakers[_id].amountStaked + interest);
    }

    function getTotalVolume() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function totalStakedAmount() external view returns (uint256) {
        return totalAmountStaked;
    }

    function pause() external onlyOwner {
        _pause();
    }

    // function to unpause the contract after any issue which occurs gets resolved
    function unpause() external onlyOwner {
        _unpause();
    }

    modifier onlyOwner() {
        require(admin == msg.sender, "Only owner can change it");
        _;
    }

    fallback() external payable {
        revert("No known transaction");
    }
}
