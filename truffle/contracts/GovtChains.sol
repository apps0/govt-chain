pragma solidity >=0.4.21 <0.7.0;

contract GovtChains {
    uint public blockCount= 0;

    struct Block{
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Block) public blocks;

    event BlockCreated(
        uint id,
        string content,
        bool completed
    );

    constructor() public{
        createBlock("Initial test item");
    }

    function createBlock(string memory _content) public {
        blockCount++;
        blocks[blockCount] = Block(blockCount, _content, false);

        emit BlockCreated(blockCount, _content, false);
    }
}
