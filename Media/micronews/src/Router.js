import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Stream from "./components/Stream/Stream";
import Dashboard from "./components/Dashboard/Dashboard";
import TopNav from "./components/Nav/TopNav";

const Router = () => {
  return (
    <div className="app d-flex flex-column">
      <BrowserRouter>
        <TopNav />
        <Switch>
          <div className="outer-container">
            <div className="inner-container mx-auto d-flex">
              <Route path="/dashboard" component={Dashboard} />
              <Route exact path="/" component={Stream} />
            </div>
          </div>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Router;
