pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

enum Role{it, supportIt, intern}
enum Skill{novice, advanced, competent, profiency, expert}

struct Freak {
        string name;
        uint256 startDate;
        uint256 stopDate;
        uint256 employeeNumber;
        Role role;
        Skill skill;

}

contract FreakTeam is ERC1155, AccessControl {

    mapping(address => Freak)  public freaks;
    address[] public freakAccounts;
    bytes32 public constant FINANCIAL_ROLE = keccak256("FINANCIAL_ROLE");
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant FREAK_ROLE = keccak256("FREAK_ROLE");

    event addedFreak(address _address, string _name, uint256 startDate, uint256 employeeNumber, Role role, Skill skill);
    event deletedFreak(address _address, uint256 employeeNumber);

    constructor (address hr, address financial) ERC1155(""){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(HR_ROLE, hr);
        _setupRole(FINANCIAL_ROLE, financial);
        _setRoleAdmin(FREAK_ROLE, HR_ROLE);
    }

    function addNewFreak(address _address, string memory _name,uint256 _startDate, uint256 _employeeNumber, Role _role, Skill _skill) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
        require(freaks[_address].employeeNumber == 0, "On the address exists already one freak");
        grantRole(FREAK_ROLE, _address);
        freaks[_address] = Freak(
            {
                name: _name,
                startDate: _startDate,
                stopDate: 0,
                employeeNumber: _employeeNumber,
                role: _role,
                skill: _skill
            }
        );
        freakAccounts.push(_address);
        _mint(_address, _employeeNumber, 1, "");
        emit addedFreak(_address, _name, _startDate, _employeeNumber, _role, _skill);
    }

    function deleteFreak(address _address) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
        require(_address != msg.sender, "Caller can not remove himself");
        require(balanceOf(_address, freaks[_address].employeeNumber) > 0, "Address should contain at least 1 token");
        freaks[_address].stopDate = block.timestamp;
        _burn(_address, freaks[_address].employeeNumber, 1);
        emit deletedFreak(_address, freaks[_address].employeeNumber);
   }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}