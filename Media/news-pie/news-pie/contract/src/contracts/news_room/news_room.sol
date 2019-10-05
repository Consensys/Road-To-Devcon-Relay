pragma solidity 0.5.11;

contract NewsRoom {
    /* ==== EVENTS ==== */
    event OnCreateNewsTeam(
        bytes32 indexed _teamName,
        address _creator,
        uint256 _timestamp
    );

    event OnNewAnchor(
        bytes32 indexed _teamName,
        address indexed _anchor,
        address _sponsor,
        uint256 _timestamp
    );

    event OnCreateNewsStory(
        bytes32 indexed _teamName,
        address _anchor,
        string _headline,
        string _url,
        bytes32[] _tags,
        uint256 _timestamp
    );

    event OnCreateNewsTopic(
        bytes32 indexed _teamName,
        bytes32 indexed _tag,
        address _anchor,
        string _headline,
        string _url,
        bytes32[] _tags,
        uint256 _timestamp
    );

    mapping (bytes32 => bool) teamMap;
    mapping (bytes32 => mapping(address => bool)) anchorMap;
    mapping (address => bytes32[]) anchorTeamMap;

    address private owner;

    constructor() public {
        owner = msg.sender;
    }

    function createNewsTeam(string memory teamName, address[] memory anchorList)
        public
    {
        require(isValidTeamName(teamName), "Invalid Team Name");

        bytes32 _teamName;
        assembly {
            _teamName := mload(add(teamName, 32))
        }

        require(isTeamNameAvailable(_teamName), "Team Name already Created");

        teamMap[_teamName] = true;

        emit OnCreateNewsTeam(
            _teamName,
            msg.sender,
            block.timestamp
        );

        for (uint i = 0; i < anchorList.length; i++) {
            anchorMap[_teamName][anchorList[i]] = true;
            anchorTeamMap[anchorList[i]].push(_teamName);
            emit OnNewAnchor(
                _teamName,
                anchorList[i],
                msg.sender,
                block.timestamp
            );
        }
    }

    function createNewsStory(bytes32 teamName, string memory headline, string memory url, bytes32[] memory tags)
        public
    {
        require(anchorMap[teamName][msg.sender], "Must be a member of this News Team");

        emit OnCreateNewsStory(
            teamName,
            msg.sender,
            headline,
            url,
            tags,
            block.timestamp
        );

        for (uint i = 0; i < tags.length; i++) {
            emit OnCreateNewsTopic(
                teamName,
                tags[i],
                msg.sender,
                headline,
                url,
                tags,
                block.timestamp
            );
        }
    }

    function addAnchor(bytes32 teamName, address anchor)
        public
    {
        require(anchorMap[teamName][msg.sender], "Must be a member of this Team");
        require(!anchorMap[teamName][anchor], "Already a member of this Team");

        anchorMap[teamName][anchor] = true;
        anchorTeamMap[anchor].push(teamName);

        emit OnNewAnchor(
            teamName,
            anchor,
            msg.sender,
            block.timestamp
        );
    }

    function getTeams(address anchor)
        public
        view
        returns(bytes32[] memory)
    {
        return anchorTeamMap[anchor];
    }

    function isValidTeamName(string memory vanityString)
        public
        pure
        returns (bool)
    {
        bytes memory vanityBytes = bytes(vanityString);
        uint256 stringLength = vanityBytes.length;

        // Name must be between 1 and 32 characters
        if (stringLength < 1 || stringLength > 32) {
            return false;
        }

        // Can not begin or end with a space
        if (vanityBytes[0] == 0x20 || vanityBytes[stringLength - 1] == 0x20) {
            return false;
        }

        // Can not begin with the number 0
        if (vanityBytes[0] == 0x30) {
            return false;
        }

        // Validate each character in the name
        for (uint i; i < vanityBytes.length; i++) {
            byte char = vanityBytes[i];

            if (
                !(char >= 0x30 && char <= 0x39) && //0-9
                !(char >= 0x61 && char <= 0x7A) && //a-z
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char == 0x20) && //space
                !(char == 0x5F) && //_
                !(char == 0x2E) //.
            ) {
                return false;
            }
        }

        return true;
    }

    function isTeamNameAvailable(bytes32 teamName)
        public
        view
        returns (bool)
    {
        return !teamMap[teamName];
    }

    function kill()
        public
    {
        if (msg.sender == owner) {
            selfdestruct(msg.sender);
        }
    }
}