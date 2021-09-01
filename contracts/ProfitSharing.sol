pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./FreakTeam.sol";

contract ProfitSharing is FreakTeam, ERC20 {
    string profitSharing;
    string PFS;
    uint16 numberOfTransaction;
    address contractAddress;
    mapping(address => uint256) freakProfit;

    event allocatedProfit(uint256 amount, uint256 startQuarterDate, uint256 endQuarterDate);

    modifier onlyFINANCIAL() {
        require(hasRole(FINANCIAL_ROLE, msg.sender), "Caller is not a financial");
        _;
    }

    constructor(
        address hr,
        address financial,
        address _contractAddress
    ) FreakTeam(hr, financial) ERC20(profitSharing, PFS) {
        setContractAddress(contractAddress, _contractAddress);
        _setupRole(FINANCIAL_ROLE, financial);
        _setupRole(FINANCIAL_ROLE, msg.sender);
    }

    function setAmount(address financial, uint256 amount) external onlyFINANCIAL {
        safeTransferFrom(financial, contractAddress, numberOfTransaction++, amount, "");
    }


    /**
        @param amount  Freak wallet address
        @return It returns freak procentage for one freak
        @dev It returns freak procentage * 10000 because solidity doesen't accept decimals 
     */
    function getShare(uint256 amount) internal view returns (uint256) {
        return (amount / totalScore);
    }

    function setContractAddress(address oldAddress, address newAddress) internal pure {
        oldAddress = newAddress;
    }

    function quarterProfit(
        uint256 startOfQuarter,
        uint256 endOfQuarter,
        uint256 startDate
    ) internal pure returns (uint256) {
        return ((endOfQuarter - startDate) / (endOfQuarter - startOfQuarter));
    }
}
