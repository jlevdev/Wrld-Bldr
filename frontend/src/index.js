import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

function RootComponent() {
  return (
    <Router>
      <App />
    </Router>
  );
}

const routing = <RootComponent />;
ReactDOM.render(routing, document.getElementById("root"));
