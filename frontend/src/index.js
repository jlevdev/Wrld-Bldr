import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";

import LandingPage from "./components/LandingPage";
import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Account from "./components/Account";
import AllSettlements from "./components/AllSettlements";
import SettlementPlayer from "./components/SettlementPlayer";
import Settlement from "./components/Settlement";


const theme = createTheme({
  palette: {
    primary: {
      main: "#42FFFF",
      dark: "#1FC1C1",
      darker: "#097474"
    },
    secondary: {
      main: "#202028",
    },
    white: {
      main: "#DADADA"
    }
  },
});

const routing = (
  <Router>
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/account/:id" element={<Account />} />
          <Route exact path="/settlement/:id" element={<Settlement />} />
          <Route exact path="/settlements/:id" element={<AllSettlements />} />
          <Route exact path="/playerview/:id" element={<SettlementPlayer />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </React.StrictMode>
  </Router>
);
ReactDOM.render(routing, document.getElementById("root"));
