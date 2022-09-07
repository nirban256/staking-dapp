// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Token {
    string public name;
    string public symbol;

    uint8 private decimals;
    uint256 private totalSupply;
    address public owner;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 amount
    );

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        decimals = 18;
        owner = msg.sender;

        _mint(100 * (10**6) * 10**decimals); // 100m tokens for distribution
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external {
        require(msg.sender != address(0), "transfer from the zero address");
        require(_to != address(0), "transfer to the zero address");

        uint256 fromBalance = balances[_from];
        require(
            fromBalance >= _amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            balances[_from] = fromBalance - _amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved
            // by decrementing then incrementing.
            balances[_to] += _amount;
        }

        emit Transfer(_from, _to, _amount);
    }

    function approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) public {
        require(
            msg.sender != address(0),
            "ERC20: approve from the zero address"
        );
        require(_spender != address(0), "ERC20: approve to the zero address");

        allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    function balanceOf(address _account) public view returns (uint256) {
        return balances[_account];
    }

    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return allowances[_owner][_spender];
    }

    function increaseAllowance(address _spender, uint256 addedValue)
        public
        virtual
        returns (bool)
    {
        address _owner = msg.sender;
        approve(_owner, _spender, allowance(_owner, _spender) + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 value)
        public
        virtual
        returns (bool)
    {
        address _owner = msg.sender;
        uint256 currentAllowance = allowance(_owner, spender);
        require(currentAllowance >= value, "decreased allowance below zero");

        unchecked {
            approve(owner, spender, currentAllowance - value);
        }

        return true;
    }

    function _mint(uint256 _amount) public onlyOwner {
        require(owner != address(0), "Owner cannot be the zero address");

        totalSupply += _amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            balances[owner] += _amount;
        }

        emit Transfer(address(0), owner, _amount);
    }

    function _burn(address _account, uint256 _amount) external onlyOwner {
        require(_account != address(0), "burn from the zero address");

        uint256 accountBalance = balances[_account];
        require(accountBalance >= _amount, "burn amount exceeds balance");
        unchecked {
            balances[_account] = accountBalance - _amount;
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            totalSupply -= _amount;
        }

        emit Transfer(_account, address(0), _amount);
    }
}
