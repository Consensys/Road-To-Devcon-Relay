const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic =
  "visual jump vague melt ramp arrow police fire siege candy tag any";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id,
      gasPrice: 0x1,
      gas: 0x1fffffffffffff
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://ropsten.infura.io/v3/07ed7736f59d4f8488a126f08c344233"
        );
      },
      network_id: 3
    }
  }
};
