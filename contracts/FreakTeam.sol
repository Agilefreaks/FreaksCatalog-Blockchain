pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";



enum Role{it, supportIt, intern}
enum Skill{novice, advanced, competent, profiency, expert}

struct Freak {
        string name;
        uint256 startDate;
        uint256 employeeNumber;
        Role choiceRole;
        Skill choiceSkill;

}





contract FreakTeam is ERC1155, AccessControl {

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {    // function created to avoid override
        return super.supportsInterface(interfaceId);
    }

    mapping(address => Freak)  public freaks;
    address[] public freakAccts;

    bytes32 public constant FINANCIAL_ROLE = keccak256("FINANCIAL");
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant FREAK_ROLE = keccak256("FREAK_ROLE");

    event addedFreak(string _name, uint256 startDate, uint256 employeeNumber, Role role, Skill skill);

        constructor (address hr, address financial) ERC1155(""){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(HR_ROLE, hr);
        _setupRole(FINANCIAL_ROLE, financial);
    }


    function addNewFreak(address _address, string memory _name,uint256 _startDate, uint256 _employeeNumber, Role _role, Skill _skill) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
        freaks[_address].name = _name;
        freaks[_address].startDate = _startDate;
        freaks[_address].employeeNumber = _employeeNumber;
        freaks[_address].choiceRole = _role;
        freaks[_address].choiceSkill = _skill;
        freakAccts.push(_address);
        // grantRole(FREAK_ROLE, _address);
        // _mint(msg.sender, _employeeNumber, 1, "");
        // emit addedFreak(_name,_startDate, _employeeNumber,_role, _skill);
 
    }
}

