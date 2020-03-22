const GovtChains = artifacts.require("GovtChains.sol");

contract("GovtChains", async accounts => {
  before(async () => {
    this.govtChains = await GovtChains.deployed();
  });

  it("deploys successfully", async () => {
    const address = await this.govtChains.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("lists blocks", async () => {
    const blockCount = await this.govtChains.blockCount();
    const block = await this.govtChains.blocks(blockCount);

    assert.equal(block.id.toNumber(), blockCount.toNumber());
    assert.equal(block.content, 'Initial test item');
    assert.equal(block.completed, false);
    assert.equal(blockCount.toNumber(), 1);
  });

  it("create blocks", async () => {
    const result = await this.govtChains.createBlock('A new block');
    const blockCount = await this.govtChains.blockCount();
    
    assert.equal(blockCount,2)
    const event = result.logs[0].args;
    assert.equal(event.id.toNumber(),2)
    assert.equal(event.content,'A new block')
    assert.equal(event.completed,false)
  });
});
