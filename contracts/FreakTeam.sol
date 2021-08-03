pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

enum Role{it, supportIt}
enum Skill{master, expert, proficient, competent, advanced, novice}

struct Freak {
        string name;
        uint256 startDate;
        uint256 stopDate;
        uint256 employeeNumber;
        Role role;
        Skill skill;
}

contract FreakTeam is ERC1155, AccessControl {
    uint256 k = 0;  
    mapping(address => uint) public freakShare;
    mapping(address => Freak)  public freaks;
    mapping(uint => address) public key;
    address[] public freakAccounts;
    bytes32 public constant FINANCIAL_ROLE = keccak256("FINANCIAL_ROLE");
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant FREAK_ROLE = keccak256("FREAK_ROLE");

    event addedFreak(address _address, string _name, uint256 startDate, uint256 employeeNumber, Role role, Skill skill);
    event deletedFreak(address _address, uint256 employeeNumber);
    event promotedFreak(uint256 freakId, Skill oldSkillLevel, Skill newSkillLevel);
    event listedFreak(string name, Role role, Skill skill, uint256 startDate, address walletAddress, uint256 share);

    constructor (address hr) ERC1155(""){
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(HR_ROLE, hr);
        _setRoleAdmin(FREAK_ROLE, HR_ROLE);
    }

    function addNewFreak(address _address, string memory _name,uint256 _startDate, uint256 _employeeNumber, Role _role, Skill _skill) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
        require(freaks[_address].employeeNumber == 0, "On the address exists already one freak");
        grantRole(FREAK_ROLE, _address);
        freaks[_address] = Freak(
                _name,
                _startDate,
                0,
                _employeeNumber,
                _role,
                _skill
        );
        freakAccounts.push(_address);
        _mint(_address, _employeeNumber, 1, "");
        key[k++] = _address;        // to save address at position k
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

   function promoteFreak(address _address, Skill newSkill) external {
       require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
       require(_address != msg.sender, "Caller can not promote himself");
       Skill oldSkill = freaks[_address].skill;
       freaks[_address].skill = newSkill;
       emit promotedFreak(freaks[_address].employeeNumber, oldSkill, newSkill);
   }

    function calculateShare(uint256 startOfQuarter, uint256 endOfQuarter) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not hr");
        for(uint i = 0; i < freakAccounts.length; i++) {
            freakShare[key[i]] = getSum(freaks[key[i]].role, freaks[key[i]].skill, freaks[key[i]].employeeNumber,
             getQuarter(startOfQuarter, endOfQuarter, freaks[key[i]].startDate));
            emit listedFreak(freaks[key[i]].name, freaks[key[i]].role, freaks[key[i]].skill, freaks[key[i]].startDate, key[i], freakShare[key[i]]);
        }
    }
    
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }   

    function totalShares(uint256 startOfQuarter, uint256 endOfQuarter) internal view returns(uint) {
        uint256 total;
        for(uint i = 0; i < freakAccounts.length; i++) {
            total += getSum(freaks[key[i]].role, freaks[key[i]].skill, freaks[key[i]].employeeNumber,
             getQuarter(startOfQuarter, endOfQuarter, freaks[key[i]].startDate));
        }
        return total;   
    }

    function getRoleValue(Role _role) internal pure returns(uint) { 
        if(Role.it == _role) return 100;
        if(Role.supportIt == _role) return 85;
    }

    function getSkillValue(Skill _skill) internal pure returns(uint) {
        if(Skill.novice == _skill) return 50;
        if(Skill.advanced == _skill) return 70;
        if(Skill.competent == _skill) return 75;
        if(Skill.proficient == _skill) return 80;
        if(Skill.expert == _skill) return 90;
        if(Skill.master == _skill) return 100;
    }

    function getRiskValue(uint256 _employeeNumber) internal pure returns(uint) {
        if(_employeeNumber >= 0 && _employeeNumber <= 5) return 100;
        if(_employeeNumber > 5 && _employeeNumber <= 25) return 90;
        if(_employeeNumber > 25 && _employeeNumber <= 50) return 80;
        if(_employeeNumber > 50) return 60;
    }

    function getSum(Role a, Skill b, uint256 c, uint256 d) internal pure returns(uint) {
        return (getRoleValue(a) + getSkillValue(b) + getRiskValue(c) + d) / 4;
    }

    function getQuarter(uint256 startOfQuarter, uint256 endOfQuarter,uint256 startDate) internal pure returns(uint) {
        uint256 quarterForumula;
        if(endOfQuarter < startDate )
            return 0;
        else
            quarterForumula = uint((endOfQuarter - startDate)/(endOfQuarter - startOfQuarter))*100;
        if(quarterForumula > 100)
            return 100;
        else
            return quarterForumula;
    }
}