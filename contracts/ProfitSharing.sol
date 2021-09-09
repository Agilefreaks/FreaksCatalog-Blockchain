pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "hardhat/console.sol";
import "./FreakTeam.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProfitSharing {
    ERC20 token;
    FreakTeam freakTeam;
    uint256 profitAllocated;
    address financial;

    event allocatedProfit(uint256 amount, uint256 startQuarterDate, uint256 endQuarterDate);
    event withdrewProfit(string name, address toAddress, uint256 amount);

    modifier onlyFinancial(address _address) {
        require(freakTeam.isFinancial(_address), "Caller is not a financial");
        _;
    }

    constructor(ERC20 _token, FreakTeam _freakTeam) {
        token = _token;
        freakTeam = _freakTeam;
    }

    /**
        @notice Tranfers amount from financial to contract and assigns it to all freaks 
        @param amount - amount transmitted by financial
        @param startOfQuarter - The beginning of the period in which the profit is distributed
        @param endOfQuarter - End of the period in which the profit is distributed
     */
    function allocate(
        uint256 amount,
        uint256 startOfQuarter,
        uint256 endOfQuarter
    ) external onlyFinancial(msg.sender) {
        require(token.balanceOf(msg.sender) >= amount, "You don't have this sum for transfer");
        token.transferFrom(msg.sender, address(this), amount);
        uint256 freaksCount = freakTeam.getFreakCount();
        for (uint256 eachFreak = 0; eachFreak < freaksCount; eachFreak++) {
            address freakAddress = freakTeam.freakAccounts(eachFreak);
            profitAllocated = (freakTeam.getFreak(freakAddress).score * getShare(amount));
            token.increaseAllowance(freakAddress, profitAllocated);
        }
        emit allocatedProfit(amount, startOfQuarter, endOfQuarter);
    }

    string name;
    uint256 startDate;
    uint256 stopDate;
    uint16 employeeNumber;
    Role role;
    Skill skill;
    Norm norm;
    uint256 score;

    /**
        @notice - It transfers the money from the smartContract to the address where the freak wants to withdraw the money
        @notice - The amount the freak wants to withdraw
     */
    function withdrawProfit(address _newWalletAddress, uint256 amount) external {
        require(token.allowance(address(this), msg.sender) >= amount, "You don't have such a large amount allocated");
        if (_newWalletAddress == msg.sender) {
            _newWalletAddress = msg.sender;
        }
        token.transfer(_newWalletAddress, amount);
        token.decreaseAllowance(msg.sender, amount);
        emit withdrewProfit(freakTeam.getFreak(msg.sender).name, _newWalletAddress, amount);
    }

    /**
        @notice It shows the maximum amount the freak can withdraw
     */
    function allocation() external view returns (uint256) {
        return (token.allowance(address(this), msg.sender));
    }

    /**
        @param amount  Freak wallet address
        @return It returns freak procentage for one freak
        @dev It returns freak procentage * 10000 because solidity doesen't accept decimals 
     */
    function getShare(uint256 amount) internal view returns (uint256) {
        return (amount / freakTeam.totalScore());
    }

    function quarterProfit(
        uint256 startOfQuarter,
        uint256 endOfQuarter,
        uint256 startDate
    ) internal pure returns (uint256) {
        return ((endOfQuarter - startDate) / (endOfQuarter - startOfQuarter));
    }
}
