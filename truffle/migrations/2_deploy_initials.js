const ProjectsChain = artifacts.require("ProjectsChain.sol");
const QuotationsChain = artifacts.require("QuotationsChain.sol");
const ContractorsChain = artifacts.require("ContractorsChain.sol");
const ProgressChain = artifacts.require("ProgressChain.sol");

module.exports = function (deployer) {
  deployer.deploy(ProjectsChain);
  deployer.deploy(QuotationsChain);
  deployer.deploy(ContractorsChain);
  deployer.deploy(ProgressChain);
};
