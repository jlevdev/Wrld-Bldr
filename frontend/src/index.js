import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3bdb66",
    },
    secondary: {
      main: "#d6d6d6",
    },
  },
});

const routing = (
  <Router>
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
        <Footer />
      </ThemeProvider>
    </React.StrictMode>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
