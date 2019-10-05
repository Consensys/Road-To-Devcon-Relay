import React, { Component } from "react";
import MicronewsContract from "./contracts/Micronews.json";
import getWeb3 from "./utils/getWeb3";
import Base from "./Base";
import Web3Provider from "web3-react";

import "./App.css";

import { Connectors } from "web3-react";
const { InjectedConnector, NetworkOnlyConnector } = Connectors;
const MetaMask = new InjectedConnector({ supportedNetworks: [1, 3, 4] });
const Local = new NetworkOnlyConnector({
  providerURL: "http://127.0.0.1:7545"
});

const connectors = { MetaMask, Local };

class App extends Component {
  render() {
    return (
      <Web3Provider
        connectors={connectors}
        libraryName={"ethers.js" | "web3.js" | null}
      >
        <div className="app">
          <div className="d-flex flex-column">
          <div className="position-relative">
            
          </div>
            <div className="big-container mx-auto">
              <Base />
            </div>
          </div>
        </div>
      </Web3Provider>
    );
  }
}

export default App;
