pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./USDC.sol";
import "./FreakTeam.sol";

contract ProfitSharing is FreakTeam {
    USDC usdcContract;
    uint256 profitAllocated;
    address financial;

    event allocatedProfit(uint256 amount, uint256 startQuarterDate, uint256 endQuarterDate);
    event withdrewProfit(string name, address toAddress, uint256 amount);

    modifier onlyFINANCIAL() {
        require(hasRole(FINANCIAL_ROLE, msg.sender), "Caller is not a financial");
        _;
    }

    constructor(
        address _hr,
        address _financial,
        USDC _usdcContract
    ) FreakTeam(_hr, _financial) {
        usdcContract = _usdcContract;
        _setupRole(FINANCIAL_ROLE, _financial);
        financial = _financial;
        _setupRole(FINANCIAL_ROLE, msg.sender);
    }

    /**
        @notice Tranfers amount from financial to contract and assigns it to all freaks 
        @param amount - amount transmitted by financial
        @param startOfQuarter - The beginning of the period in which the profit is distributed
        @param endOfQuarter - End of the period in which the profit is distributed
     */
    function setAmount(
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) external onlyFINANCIAL {
        require(usdcContract.balanceOf(msg.sender) >= amount, "You don't have this sum for transfer");
        usdcContract.transferFrom(msg.sender, address(this), amount);
        allocate(amount, startOfQuarter, endOfQuarter);
        emit allocatedProfit(amount, startOfQuarter, endOfQuarter);
    }

    /**
        @notice - It transfers the money from the smartContract to the address where the freak wants to withdraw the money
        @notice - The amount the freak wants to withdraw
     */
    function withdrawProfit(address _newWalletAddress, uint256 amount) external {
        require(usdcContract.allowance(address(this), msg.sender) >= amount, "You don't have such a large amount allocated");
        if (_newWalletAddress == msg.sender) {
            _newWalletAddress = msg.sender;
        }
        usdcContract.transfer(_newWalletAddress, amount);
        usdcContract.decreaseAllowance(msg.sender, amount);
        emit withdrewProfit(freaks[msg.sender].name, _newWalletAddress, amount);
    }

    /**
        @notice It shows the maximum amount the freak can withdraw
     */
    function Allocation() external view returns (uint256) {
        return (usdcContract.allowance(address(this), msg.sender));
    }

    /**
        @param amount  Freak wallet address
        @return It returns freak procentage for one freak
        @dev It returns freak procentage * 10000 because solidity doesen't accept decimals 
     */
    function getShare(uint256 amount) internal view returns (uint256) {
        return (amount / totalScore);
    }

    function quarterProfit(
        uint256 startOfQuarter,
        uint256 endOfQuarter,
        uint256 startDate
    ) internal pure returns (uint256) {
        return ((endOfQuarter - startDate) / (endOfQuarter - startOfQuarter));
    }

    /**
        @notice - Allocate the profit to each freak
     */
    function allocate(
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) internal onlyFINANCIAL {
        for (uint256 eachFreak = 0; eachFreak < freakAccounts.length; eachFreak++) {
            address freakAddress = freakAccounts[eachFreak];
            profitAllocated = (freaks[freakAddress].score * getShare(amount));
            usdcContract.increaseAllowance(freakAddress, profitAllocated);
        }
    }
}
