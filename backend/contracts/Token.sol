// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint8 constant _decimals = 18;
    uint256 constant _totalSupply = 100 * (10**6) * 10**_decimals; // 100m tokens for distribution

    constructor() ERC20("Potato", "PTK") {
        _mint(msg.sender, _totalSupply);
    }
}
