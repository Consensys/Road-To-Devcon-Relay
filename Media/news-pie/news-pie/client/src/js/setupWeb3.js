import { ethers } from 'ethers';

const urlParams = new URLSearchParams(window.location.search);

export default async function setupWeb3() {
  if (urlParams.get('place') === 'newsroom') {
    if (window.ethereum || window.web3) {
      if (window.ethereum) {
        console.log('enable ethereum');
        await window.ethereum.enable();
      }
      window.dapp.provider = new ethers.providers.Web3Provider(web3.currentProvider);
    } else {
      window.dapp.provider = new ethers.providers.BaseProvider();
    }
  } else {
    window.dapp.provider = new ethers.providers.BaseProvider();
  }
}