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
    uint256 private totalSupply;

    struct Stakers {
        uint256 amount;
        uint256 startTime;
        uint256 claimed;
    }

    mapping(address => Stakers) private stakerBalances;

    address[] private stakersAddresses;

    event Staked(address indexed from, uint256 amount);
    event Claimed(address indexed from, uint256 amount);

    constructor(address _tokenContract) {
        token = _tokenContract;
        admin = msg.sender;
        totalSupply = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "You don't have the required permission");
        _;
    }

    function getTotalVolume() public view returns (uint256) {
        return totalSupply;
    }

    function getStakersAddresses()
        public
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return stakersAddresses;
    }

    function getStakersBalances(address _account)
        public
        view
        onlyOwner
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (
            stakerBalances[_account].amount,
            stakerBalances[_account].startTime,
            stakerBalances[_account].claimed
        );
    }

    function stakeTokens(uint256 _amount) external {
        require(_amount > 0, "Value must be greater than zero");
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient Balance");

        token.transferFrom(msg.sender, address(this), _amount);

        uint256 flag = 0;
        for (uint256 i = 0; i < stakersAddresses.length; i++) {
            if (stakersAddresses[i] == msg.sender) {
                stakerBalances[i].amount += _amount;
                flag++;
                break;
            }
        } // Error: staking again without claiming will get to receive the caller of the contract more interest on the tokens inspite being staked later due to startTime property.

        if (flag == 0) {
            stakerBalances[msg.sender] = Stakers({
                amount: _amount,
                startTime: block.timestamp,
                claimed: 0
            });
            stakersAddresses.push(msg.sender);
        }

        totalSupply += _amount;

        emit Staked(msg.sender, _amount);
    }

    function calculateInterest(address _account, uint256 _amount)
        internal
        returns (uint256)
    {
        require(_account != address(0), "Owner cannot be the zero address");

        uint256 totalTokens = 0;
        uint256 comissionAmount = 0;
        if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 86400 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 172800
        ) {
            totalTokens = ((_amount * 2) / 100);
            comissionAmount = 100 * 10**9 wei;
        }
        // day 2
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 172800 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 259200
        ) {
            totalTokens = ((_amount * 3) / 100);
            comissionAmount = 80 * 10**9 wei;
        }
        // day 3
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 259200 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 345600
        ) {
            totalTokens = ((_amount * 4) / 100);
            comissionAmount = 70 * 10**9 wei;
        }
        // day 4
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 345600 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 432000
        ) {
            totalTokens = ((_amount * 5) / 100);
            comissionAmount = 60 * 10**9 wei;
        }
        // day 5
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 432000 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 518400
        ) {
            totalTokens = ((_amount * 6) / 100);
            comissionAmount = 50 * 10**9 wei;
        }
        // day 6
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 518400 &&
            Stakers[_account].startTime + block.timestamp <
            Stakers[_account].startTime + 604800
        ) {
            totalTokens = ((_amount * 7) / 100);
            comissionAmount = 40 * 10**9 wei;
        }
        // day 7
        else if (
            Stakers[_account].startTime + block.timestamp >=
            Stakers[_account].startTime + 604800
        ) {
            totalTokens = ((_amount * 8) / 100);
            comissionAmount = 30 * 10**9 wei;
        }
        // day 0
        else if (
            Stakers[_account].startTime + block.timestamp <=
            Stakers[_account].startTime + 86400
        ) {
            totalTokens = _amount;
            comissionAmount = 25 * 10**9 wei;
        }

        totalTokens -= comissionAmount;

        return totalTokens;
    }

    function withdrawTokens(uint256 _amount) external whenNonReentrant {
        require(
            _amount <= stakerBalances[msg.sender].amount,
            "You don't have sufficient funds"
        );

        uint256 interestAmount = calculateInterest(msg.sender, _amount);
        stakerBalances[msg.sender].claimed = _amount + interestAmount;
        stakerBalances[msg.sender].amount -= _amount;
        totalSupply -= _amount + interestAmount;

        token.transferFrom(address(this), msg.sender, _amount + interestAmount);

        emit Claimed(address(this), _amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
