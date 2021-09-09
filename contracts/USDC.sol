pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        address _financial
    ) ERC20(_name, _symbol) {
        _mint(_financial, 10000000000000000000000000000);
    }
}
