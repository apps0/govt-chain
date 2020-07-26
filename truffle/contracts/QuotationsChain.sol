pragma solidity >=0.4.21 <0.7.0;

contract QuotationsChain {
    uint256 public blockCount = 0;

    struct Block {
        uint256 id;
        uint256 projectId;
        string projectName;
        uint256 contractorId;
        string contractorName;
        string status;
        string fileHash;
    }

    mapping(uint256 => Block) public blocks;

    event BlockCreated(uint256 id, uint256 projectId, string projectName);
    event BlockUpdated(uint256 id);

    constructor() public {
        createBlock(1, "Initial test project", 1, "Sachin", "");
    }

    function createBlock(
        uint256 _projectId,
        string memory _projectName,
        uint256 _contractorId,
        string memory _contractorName,
        string memory _fileHash
    ) public {
        blockCount++;
        blocks[blockCount] = Block(
            blockCount,
            _projectId,
            _projectName,
            _contractorId,
            _contractorName,
            "new",
            _fileHash
        );
        emit BlockCreated(blockCount, _projectId, _projectName);
    }

    function approve(uint256 _id) public {
        blocks[_id].status = "approved";

        emit BlockUpdated(_id);
    }

    function reject(uint256 _id) public {
        blocks[_id].status = "rejected";

        emit BlockUpdated(_id);
    }
}
