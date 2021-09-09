pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

enum Role {
    it,
    supportIt
}

enum Skill {
    master,
    expert,
    proficient,
    competent,
    advanced,
    novice
}

enum Norm {
    fullTime,
    partTime
}

struct Freak {
    string name;
    uint256 startDate;
    uint256 stopDate;
    uint16 employeeNumber;
    Role role;
    Skill skill;
    Norm norm;
    uint256 score;
}

/**
    @title Agile Freaks profit sharing
    @notice You can use this contract to find out the profit of each employee
*/

contract FreakTeam is ERC1155, AccessControl {
    mapping(address => Freak) public freaks;
    uint16[] roleRatioLevel = new uint16[](16);
    uint16[] skillRatioLevel = new uint16[](16);
    uint16[] normRatioLevel = new uint16[](16);
    address[] public freakAccounts;
    bytes32 public constant FINANCIAL_ROLE = keccak256("FINANCIAL_ROLE");
    bytes32 public constant HR_ROLE = keccak256("HR_ROLE");
    uint256 public totalScore = 0;

    event addedFreak(
        address _address,
        string name,
        uint256 startDate,
        uint16 employeeNumber,
        Role role,
        Skill skill,
        Norm norm,
        uint256 score
    );
    event deletedFreak(address _address, uint16 employeeNumber);
    event promotedFreak(uint16 employeeNumber, Skill oldSkillLevel, Skill newSkillLevel);
    event changedFreakNorm(uint16 employeeNumber, Norm oldNorm, Norm newNorm);

    constructor(address hr, address financial) ERC1155("") {
        setFreakDetails();
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(HR_ROLE, hr);
        _setupRole(FINANCIAL_ROLE, financial);
    }

    modifier onlyHR() {
        require(hasRole(HR_ROLE, msg.sender), "Caller is not a hr");
        _;
    }

    /**
    @notice Add a new Freak
    @param  _address  Freak wallet address
    @param _startDate Date of employment
    @param _employeeNumber  Employee number
    @param _role  The role he owns
    @param _skill The skill he owns
    @param _norm The norm he owns
     */
    function addNewFreak(
        address _address,
        string memory _name,
        uint256 _startDate,
        uint16 _employeeNumber,
        Role _role,
        Skill _skill,
        Norm _norm
    ) external onlyHR {
        require(freaks[_address].employeeNumber == 0, "On the address exists already one freak");
        freaks[_address] = Freak(
            _name,
            _startDate,
            0,
            _employeeNumber,
            _role,
            _skill,
            _norm,
            freakScore(_role, _skill, _norm, _employeeNumber)
        );
        totalScore += freakScore(_role, _skill, _norm, _employeeNumber);
        freakAccounts.push(_address);
        _mint(_address, _employeeNumber, 1, "");
        emit addedFreak(
            _address,
            _name,
            _startDate,
            _employeeNumber,
            _role,
            _skill,
            _norm,
            freakScore(_role, _skill, _norm, _employeeNumber)
        );
    }

    /**
        @notice Delete an employee from AgileFreaks
        @param _address Freak address
     */
    function deleteFreak(address _address) external onlyHR {
        require(_address != msg.sender, "Caller can not remove himself");
        require(balanceOf(_address, freaks[_address].employeeNumber) > 0, "Address should contain at least 1 token");
        freaks[_address].stopDate = block.timestamp;
        _burn(_address, freaks[_address].employeeNumber, 1);
        emit deletedFreak(_address, freaks[_address].employeeNumber);
    }

    /**
        @notice Promote one freak by changing his skill
        @param _address Freak address
        @param newSkill The skill obtained after promote
     */
    function promoteFreak(address _address, Skill newSkill) external onlyHR {
        require(_address != msg.sender, "Caller can not promote himself");
        Skill oldSkill = freaks[_address].skill;
        freaks[_address].skill = newSkill;
        emit promotedFreak(freaks[_address].employeeNumber, oldSkill, newSkill);
    }

    /**
        @notice Promote one freak by changing his norm
        @param _address Freak address
        @param newNorm The norm obtained after promote
     */
    function changeFreakNorm(address _address, Norm newNorm) external onlyHR {
        require(_address != msg.sender, "Caller can not promote himself");
        Norm oldNorm = freaks[_address].norm;
        freaks[_address].norm = newNorm;
        emit changedFreakNorm(freaks[_address].employeeNumber, oldNorm, newNorm);
    }

    /**
         @notice This functions returns all details about freaks
         @return _nume  returns an array with the name for each freak
         @return _rol  returns an array with the role for each freak
         @return _skill  returns an array with the skill for each freak
         @return _norm  returns an array with the norm for each freak
         @return _startDate  returns an array with the start date for each freak
         @return _address  returns an array with the address for each freak
         @return _score returns an array with the score for each freak
     */
    function getFreaks()
        external
        view
        returns (
            string[] memory _nume,
            Role[] memory _rol,
            Skill[] memory _skill,
            Norm[] memory _norm,
            uint256[] memory _startDate,
            address[] memory _address,
            uint256[] memory _score
        )
    {
        _nume = new string[](freakAccounts.length);
        _rol = new Role[](freakAccounts.length);
        _skill = new Skill[](freakAccounts.length);
        _norm = new Norm[](freakAccounts.length);
        _startDate = new uint256[](freakAccounts.length);
        _address = new address[](freakAccounts.length);
        _score = new uint256[](freakAccounts.length);
        for (uint256 eachFreak = 0; eachFreak < freakAccounts.length; eachFreak++) {
            Freak storage freak = freaks[freakAccounts[eachFreak]];
            _nume[eachFreak] = freak.name;
            _rol[eachFreak] = freak.role;
            _norm[eachFreak] = freak.norm;
            _skill[eachFreak] = freak.skill;
            _startDate[eachFreak] = freak.startDate;
            _address[eachFreak] = freakAccounts[eachFreak];
            _score[eachFreak] = freak.score;
        }
        return (_nume, _rol, _skill, _norm, _startDate, _address, _score);
    }

    /**
        @notice This function verify if caller is a financial
        @return it returns true if caller is finacial
     */
    function isFinancial(address _address) public view returns (bool) {
        return hasRole(FINANCIAL_ROLE, _address);
    }

    function getFreakCount() public view returns (uint256) {
        return freakAccounts.length;
    }

    function getFreak(address _address) public view returns(Freak memory freak) {
        return freaks[_address];
    }

    /**
        @notice This function sets value for roles, skills and norms
     */

    function setFreakDetails() internal {
        roleRatioLevel[uint16(Role.it)] = 100;
        roleRatioLevel[uint16(Role.supportIt)] = 85;
        skillRatioLevel[uint16(Skill.master)] = 100;
        skillRatioLevel[uint16(Skill.expert)] = 90;
        skillRatioLevel[uint16(Skill.proficient)] = 80;
        skillRatioLevel[uint16(Skill.competent)] = 75;
        skillRatioLevel[uint16(Skill.advanced)] = 70;
        skillRatioLevel[uint16(Skill.novice)] = 50;
        normRatioLevel[uint16(Norm.fullTime)] = 100;
        normRatioLevel[uint16(Norm.partTime)] = 60;
    }

    /**
        @notice Get the employee number
        @param _employeeNumber Freak employee number
        @return riskRatio It returns profit procentage  for employee number
        @dev It returns profit procentage * 100 because solidity doesn't accept decimals
     */
    function getRisk(uint16 _employeeNumber) internal pure returns (uint16 riskRatio) {
        if (_employeeNumber >= 0 && _employeeNumber <= 5) riskRatio = 100;
        else if (_employeeNumber > 5 && _employeeNumber <= 25) riskRatio = 90;
        else if (_employeeNumber > 25) riskRatio = 80;
        return riskRatio;
    }

    /**
        @notice This functions returns score for one freak and calculate the total score
        @return It returns profit procentage  for employee number
     */
    function freakScore(
        Role _role,
        Skill _skill,
        Norm _norm,
        uint16 _employeeNumber
    ) internal view returns (uint256) {
        uint256 scoreReturn = ((roleRatioLevel[uint16(_role)] +
            skillRatioLevel[uint16(_skill)] +
            normRatioLevel[uint16(_norm)] +
            getRisk(_employeeNumber)) / 4);
        return scoreReturn;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
