// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    event Staked(address indexed _staker, uint256 indexed _amount);
    event Withdraw(address indexed _withdrawer, uint256 indexed _amount);

    constructor(Token _address) {
        admin = msg.sender;
        token = _address;

        levels[120] = 300; // 3%
        levels[240] = 600; // 6%
        levels[420] = 1000; // 10%

        lockPeriods.push(120);
        lockPeriods.push(240);
        lockPeriods.push(420);

        totalAmountStaked = 0;
        stakerId = 0;
    }

    receive() external payable {
        revert("No known transaction");
    }

    function stakeChakra(uint256 _amount) external whenNotPaused {
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
        whenNotPaused
        returns (uint256)
    {
        uint256 totalTimeStaked = (block.timestamp -
            stakers[_stakerId].dateCreated); // / 60 / 24 -> for days
        uint256 interest = 0;

        for (uint256 i = 0; i <= lockPeriods.length - 1; i++) {
            if (
                totalTimeStaked >= lockPeriods[i] &&
                totalTimeStaked < lockPeriods[i + 1]
            ) {
                interest = levels[lockPeriods[i]];
            } else if (totalTimeStaked >= lockPeriods[lockPeriods.length - 1]) {
                interest = levels[420];
            }
        }

        return (interest * _amount) / 10000;
    }

    function updateStakePeriod(uint256 _numOfDays, uint256 _interest)
        external
        onlyOwner
        whenNotPaused
    {
        uint256 timeInHours = _numOfDays * 24;
        uint256 timeInSeconds = timeInHours * 60 * 60;
        levels[timeInSeconds] = _interest * 100;
        lockPeriods.push(timeInSeconds);
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
        whenNotPaused
        returns (uint256[] memory)
    {
        return stakerIdsByAddress[_address];
    }

    function amountEarned(address _staker)
        external
        view
        returns (uint256 amount)
    {
        unchecked {
            uint256[] memory stakersIds = getStakerIdsByAddresses(_staker);
            for (uint256 i; i < stakersIds.length; i++) {
                amount =
                    amount +
                    (stakers[stakersIds[i]].amountStaked +
                        calculateInterest(
                            stakers[stakersIds[i]].amountStaked,
                            stakersIds[i]
                        ));
            }
        }
        return amount;
    }

    function withdrawChakra() external nonReentrant whenNotPaused {
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
