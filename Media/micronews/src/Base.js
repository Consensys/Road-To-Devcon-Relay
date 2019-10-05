import React, { useEffect } from "react";
import { useWeb3Context } from "web3-react";
import Nav from "./components/Nav/Nav";
import Stream from "./components/Stream/Stream";
import Router from "./Router";

function Base() {
  const context = useWeb3Context();

  useEffect(() => {
    context.setFirstValidConnector(["MetaMask"]);
  }, []);

  if (!context.active && !context.error) {
    return (
      <div className="outer-container">
        <div className="inner-container mx-auto d-flex">Loading...</div>
      </div>
    );
  } else if (context.error) {
    return (
      <div className="outer-container">
        <div className="inner-container mx-auto d-flex">Error...</div>
      </div>
    );
  } else {
    return <Router />;
  }
}

export default Base;
