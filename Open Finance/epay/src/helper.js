import Web3 from 'web3'
import Torus from '@toruslabs/torus-embed'

const web3Obj = {
    web3: new Web3(),
    torus: '',
    setweb3: function (provider) {
        const web3Inst = new Web3(provider);
        web3Obj.web3 = web3Inst;
        sessionStorage.setItem('pageUsingTorus', true)
    },
    initialize: async function () {
        let torus = new Torus();
        await torus.init({
            buildEnv: 'production', // default: production
            enableLogging: false, // default: false
            network: {
                host: 'mainnet', // default: mainnet
                chainId: 1, // default: 1
                networkName: 'Main Ethereum Network' // default: Main Ethereum Network
            },
            showTorusButton: false // default: true
        });
        await torus.login();
        web3Obj.setweb3(torus.provider);
        web3Obj.torus = torus
    },
    fetchAddressUsingEmail: async function (email) {
        let torus = web3Obj.torus;
        let address = await torus.getPublicAddress(email);
        return address;
    },
    logout: async function () {
        let torus = web3Obj.torus;
        await torus.logout();
    },
};
export default web3Obj
