import displayNewsfeed from './newsfeed/display-newsfeed.js'
import displayNewsroom from './newsroom/display-newsroom.js'

export default function setupDOM() {
  displayMarkup();
}

async function displayMarkup() {
  const network = await dapp.provider.getNetwork();

  const { name, ensAddress } = network;

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has('place')) {
    if (urlParams.get('place') === 'newsfeed') {
      await displayNewsfeed();
    }
    if (urlParams.get('place') === 'newsroom') {
      await displayNewsroom();
    }
  }

  // if (name === 'rinkeby') {
    // document.getElementById('network_status').innerHTML = name;
    // show the bank
    // await displayBank();
  // } else if (genesis.hash === '0x8557a11162d51c58ee93a0e3ed63127db76b9f377dca2c35114e3af1b5e88ffd') {
    // document.getElementById('network_status').innerHTML = 'SKALE';
    // show the shop
    // await displayShop();
  // } else {
    // document.getElementById('network_status').innerHTML = 'not connected';
  // }
}