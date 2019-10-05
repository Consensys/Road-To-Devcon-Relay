import React, { useState, useEffect, useRef } from "react";
import { withRouter } from "react-router-dom";
import Web3 from "web3";
import "./Nav.css";

function TopNavItem({ text, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`mx-4 my-auto top-nav-item ${
        active ? "top-nav-active" : "top-nav-inactive"
      }`}
    >
      {text}
    </div>
  );
}

const TABS = ["Stream", "Dashboard"];

function TopNav({ history }) {
  const routes = {
    Stream: "/",
    Dashboard: "/dashboard"
  };

  const [showAccount, toggleShowAccount] = useState(false);
  const [address, setAddress] = useState("");
  const [bal, setBal] = useState("");

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    toggleShowAccount(false);
  };

  const node = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", handleClick, false);

    return () => {
      document.removeEventListener("mousedown", handleClick, false);
    };
  }, []);

  useEffect(() => {
    const get = async () => {
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);

        const address = (await web3.eth.getAccounts())[0];
        setAddress(address);

        let bal = await web3.eth.getBalance(address);
        bal = bal / 10 ** 18;
        bal = bal.toFixed(3);
        setBal(bal);
      }
    };
    get();
  }, []);

  return (
    <div className="top-nav d-flex my-auto justify-content-between outer-container">
      <div className="my-auto company-name">Micronews</div>
      <div className="d-flex nav-holder my-auto mr-5">
        {TABS.map((tab, i) => {
          return (
            <TopNavItem
              onClick={() => history.push(routes[tab])}
              text={tab}
              key={i}
              active={routes[tab] === history.location.pathname}
            />
          );
        })}
        <div
          onClick={() => toggleShowAccount(!showAccount)}
          className="account-circle"
          ref={node}
        >
          {showAccount && (
            <div className="position-relative">
              <div className="position-absolute account-dash d-flex flex-column p-1">
                <div className="address mt-2">
                  <span className="text-muted"> Acct:</span>{" "}
                  {address.slice(0, 4) + "..." + address.slice(36)}
                </div>
                <div className="address">
                  {" "}
                  <span className="text-muted"> Balance:</span> {bal} ETH
                </div>
                <div className="address">
                  {" "}
                  <span className="text-muted"> Subscriptions:</span> 3
                </div>
                <div className="address">
                  {" "}
                  <span className="text-muted"> Claimable:</span> 0.014 ETH
                </div>
                <div className="address">
                  {" "}
                  <span className="text-muted"> Quality Rating:</span> 88%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(TopNav);
