var Micronews = artifacts.require("./Micronews.sol");

module.exports = function (deployer) {
    deployer.deploy(Micronews);
};
