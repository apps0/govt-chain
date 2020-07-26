pragma solidity >=0.4.21 <0.7.0;

contract ProgressChain {
    uint256 public blockCount = 0;

    struct Block {
        uint256 id;
        uint256 projectId;
        uint256 contractorId;
        uint256 quotationId;
        string description;
        string fileHash;
    }

    mapping(uint256 => Block) public blocks;

    event BlockCreated(uint256 id);

    function createBlock(
        uint256 _projectId,
        uint256 _contractorId,
        uint256 _quotationId,
        string memory _description,
        string memory _fileHash
    ) public {
        blockCount++;
        blocks[blockCount] = Block(
            blockCount,
            _projectId,
            _contractorId,
            _quotationId,
            _description,
            _fileHash
        );
        emit BlockCreated(blockCount);
    }
}
