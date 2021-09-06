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
        _setupRole(FINANCIAL_ROLE, msg.sender);
    }

    function setAmount(
        address _contractAddress,
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) external onlyFINANCIAL {
        usdcContract.increaseAllowance(_contractAddress, amount);
        usdcContract.transferFrom(msg.sender, _contractAddress, amount);
        allocate(amount, startOfQuarter, endOfQuarter);
        emit allocatedProfit(amount, startOfQuarter, endOfQuarter);
    }

    function withdrawProfit(
        address _contractAddress,
        address _address,
        address _newWalletAddress,
        uint256 amount
    ) external {
        require(msg.sender == _address, "Caller is not a freak");
        require(
            usdcContract.allowance(msg.sender, _address) >= amount,
            "You don't have such a large amount allocated"
        );
        if (_newWalletAddress == address(0)) _newWalletAddress = _address;
        else usdcContract.allowance(_address, _newWalletAddress);
        usdcContract.transferFrom(_contractAddress, _newWalletAddress, amount);
        emit withdrewProfit(freaks[_address].name, _newWalletAddress, amount);
    }

    function Allocation(address _address) external view onlyFINANCIAL returns (string memory, uint256) {
        return (freaks[_address].name, usdcContract.allowance(msg.sender, _address));
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

    function allocate(
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) internal onlyFINANCIAL {
        for (uint256 eachFreak = 0; eachFreak < freakAccounts.length; eachFreak++) {
            address i = freakAccounts[eachFreak];
            profitAllocated = (freaks[i].score * getShare(amount));
            usdcContract.increaseAllowance(i, profitAllocated);
        }
    }
}