pragma solidity >=0.4.21 <0.7.0;

contract ProjectsChain {
    uint256 public blockCount = 0;

    struct Block {
        uint256 id;
        string name;
        string description;
        string fund;
        string status;
        uint256 quotationId;
        uint256 contractorId;
        uint256 commentCount;
    }

    struct Comment {
        uint256 id;
        uint256 projectId;
        uint256 userId;
        string displayName;
        string photoURL;
        string userType;
        string message;
        uint256 timestamp;
    }

    mapping(uint256 => mapping(uint256 => Comment)) public comments;

    mapping(uint256 => Block) public blocks;

    event CommentCreated(uint256 projectId);

    event BlockCreated(uint256 id, string name, string description);
    event BlockUpdated(uint256 id);

    constructor() public {
        createBlock("Project name", "Initial test project", "Fund 1");
    }

    function createBlock(
        string memory _name,
        string memory _description,
        string memory _fund
    ) public {
        blockCount++;
        blocks[blockCount] = Block(
            blockCount,
            _name,
            _description,
            _fund,
            "new",
            0,
            0,
            0
        );

        emit BlockCreated(blockCount, _name, _description);
    }

    function addComment(
        uint256 _projectId,
        uint256 _userId,
        string memory _displayName,
        string memory _photoURL,
        string memory _userType,
        string memory _message
    ) public {
        blocks[_projectId].commentCount++;

        comments[_projectId][blocks[_projectId].commentCount] = Comment(
            blocks[_projectId].commentCount,
            _projectId,
            _userId,
            _displayName,
            _photoURL,
            _userType,
            _message,
            now
        );

        emit CommentCreated(_projectId);
    }

    function assignQuotation(
        uint256 _id,
        uint256 _quotationId,
        uint256 _contractorId
    ) public returns (bool) {
        if (
            keccak256(abi.encodePacked(blocks[_id].status)) ==
            keccak256(abi.encodePacked("new")) &&
            _quotationId > 0
        ) {
            blocks[_id].status = "inprogress";
            blocks[_id].quotationId = _quotationId;
            blocks[_id].contractorId = _contractorId;

            emit BlockUpdated(_id);
            return true;
        }
        return false;
    }

    function complete(uint256 _id) public returns (bool) {
        if (
            keccak256(abi.encodePacked(blocks[_id].status)) ==
            keccak256(abi.encodePacked("inprogress"))
        ) {
            blocks[_id].status = "completed";

            emit BlockUpdated(_id);
            return true;
        }
        return false;
    }
}
