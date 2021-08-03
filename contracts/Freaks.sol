//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract Freaks is ERC1155, AccessControl {
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    bytes32 public constant FREAK_ROLE = keccak256("FREAK_ROLE");
    bytes32 public constant FINANCIAL_ROLE = keccak256("FINANCIAL_ROLE");

    enum Role {IT, Support}
    enum Skill {Novice, Advanced, Competent, Proficient, Expert, Master}
    event addedFreak(string _name, Role rol, Skill skill, uint256 startDate, uint256 employeeNumber, address adresa);

    struct Freak {
    string name;
    Role rol;
    Skill skill;
    uint256 startDate;
    uint256 stopDate;
    uint16 employeeNumber;
    }
        
    mapping(address => Freak) public freakStruct;
    address[] public freaks;    

    constructor (address hr, address financial) ERC1155(""){
         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
         _setupRole(HR_ROLE, hr);
         _setupRole(FINANCIAL_ROLE, financial);
         _setRoleAdmin(FREAK_ROLE, HR_ROLE);
    }

    function addFreak(string memory _name, Role _rol, Skill _skill, uint256 _startDate, uint16 _employeeNumber, address _adresa) external {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not HR");
        require(freakStruct[_adresa].employeeNumber == 0, "employeeNumber trebuie sa fie default, ca sa nu se poata adauga peste un alt Freak deja existent");
        grantRole(FREAK_ROLE, _adresa);
        freaks.push(_adresa);
        freakStruct[_adresa] = Freak(
            _name,
            _rol,
            _skill,
            _startDate,
            0,
            _employeeNumber
        );
        emit addedFreak(_name, _rol, _skill, _startDate, _employeeNumber, _adresa);
        _mint(_adresa, _employeeNumber, 1, "");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

}   