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
    string profitSharing;
    uint16 numberOfTransaction;
    address financial;
    uint256 profitAllocated;

    event transferredToContract(address financial, address contractAddress, uint256);
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

    function setAmount(address _contractAddress, uint256 amount) external onlyFINANCIAL {
        console.log("Persoana care da deploy este:", msg.sender);
        console.log("Addresa la care vreau sa trimit banii:",_contractAddress);
        console.log("Suma pe care vreau sa o trimit:",amount);
        console.log("Balanta persoanei care da deploy este: ", usdcContract.balanceOf(msg.sender));
        console.log("---------");
        // usdcContract.allowance(msg.sender, _contractAddress);
        // console.log(usdcContract.allowance(msg.sender, _contractAddress));
        // usdcContract.approve(_contractAddress, amount);
        usdcContract.increaseAllowance(_contractAddress, amount);
        // console.log("Persoana care da deploy ii creste balanta:", usdcContract.increaseAllowance(_contractAddress, amount));
        usdcContract.allowance(msg.sender, _contractAddress);
        console.log(usdcContract.allowance(msg.sender, _contractAddress));
        usdcContract.transferFrom(msg.sender, _contractAddress, amount);
        emit transferredToContract(msg.sender, _contractAddress, amount);
        // safeTransferFrom(_financial, _contractAddress, freaks[_financial].employeeNumber, amount, "");
    }

    function allocate(
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) external onlyFINANCIAL {
        for (uint256 eachFreak = 0; eachFreak < freakAccounts.length; eachFreak++) {
            address i = freakAccounts[eachFreak];
            profitAllocated = (freaks[i].score *
                getShare(amount) *
                quarterProfit(startOfQuarter, endOfQuarter, freaks[i].startDate));
            usdcContract.allowance(msg.sender, i);
            usdcContract.increaseAllowance(i, profitAllocated);
        }
        emit allocatedProfit(amount, startOfQuarter, endOfQuarter);
    }

    function withdrawProfit(
        address _address,
        address _newWalletAddress,
        uint256 amount
    ) external {
        require(msg.sender == _address, "You need to be a freak to withdraw profit");
        require(usdcContract.allowance(msg.sender, _address) >= amount, "you don't have such a large amount allocated");
        if (_newWalletAddress == address(0)) _newWalletAddress = _address;
        else usdcContract.allowance(_address, _newWalletAddress);
        usdcContract.increaseAllowance(_newWalletAddress, profitAllocated);
        usdcContract.transferFrom(_address, _newWalletAddress, amount);
        emit withdrewProfit(freaks[_address].name, _newWalletAddress, amount);
    }

    function showAllocation(address _address) external view onlyFINANCIAL returns (string memory, uint256) {
        return (freaks[_address].name, usdcContract.allowance(financial, _address));
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
