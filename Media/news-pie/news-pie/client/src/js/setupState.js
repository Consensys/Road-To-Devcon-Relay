import newsroomABI from './contracts/newsroom.sol.js';
import { ethers } from 'ethers';

export default async function setupState() {
  window.dapp.contracts = {
    NewsRoom: {
      address: newsroomABI.address,
      contract: await getContract(),
    },
  };
}

async function getContract() {
  const network = await window.dapp.provider.getNetwork();
  
  if (network.name === 'ropsten') {
    return new ethers.Contract(newsroomABI.address, newsroomABI.abi, window.dapp.provider.getSigner());
  }
  return new ethers.Contract(newsroomABI.address, newsroomABI.abi, window.dapp.provider);
}