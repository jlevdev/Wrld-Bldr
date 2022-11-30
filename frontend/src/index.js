import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

function RootComponent() {
  return (
    <Router>
      <App />
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RootComponent />);