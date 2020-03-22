const GovtChains = artifacts.require("GovtChains.sol");

module.exports = function(deployer) {
  deployer.deploy(GovtChains);
};
