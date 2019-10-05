import MicronewsContract from "../contracts/Micronews.json";
import Web3 from "web3";

const ROPSTEN_MICRONEWS_ADDRESS = "0xeE6EB8309013401016aBC546E73695174D66B177";

const getContract = async () => {
  await window.ethereum.enable();
  const web3 = new Web3(window.web3);
  const accounts = await web3.eth.getAccounts();

  const networkId = await web3.eth.net.getId();
  const deployedNetwork = MicronewsContract.networks[networkId];

  const instance = new web3.eth.Contract(
    MicronewsContract.abi,
    ROPSTEN_MICRONEWS_ADDRESS
  );
  return {
    accounts,
    web3,
    contract: instance
  };
};

export default getContract;
