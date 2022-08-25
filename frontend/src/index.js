import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AppContext from "./AppContext";

import App from "./App";
import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Account from "./components/Account";
import AllSettlements from "./components/AllSettlements";
import SettlementPlayer from "./components/SettlementPlayer";
import Settlement from "./components/Settlement";
import { func } from "prop-types";


const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontFamily: 'PT Sans'
    },
    h2: {
      fontFamily: 'PT Sans'
    },
    h3: {
      fontFamily: 'PT Sans'
    },
    h4: {
      fontFamily: 'PT Sans'
    },
    h5: {
      fontFamily: 'PT Sans'
    },
    h6: {
      fontFamily: 'PT Sans'
    },
  },
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
    },
    background: {
      main: "#DADADA"
    },
  },
});



function RootComponent() {
  const [user, setUser] = useState({ username: "jame" });

  return (
    <Router>
      <React.StrictMode>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <Header />
          <Box
            sx={{
              width: 1,
              height: "100vh",
              backgroundImage:
                "url(https://wallpaperaccess.com/full/1399270.jpg)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",

            }}
          >
            <AppContext.Provider value={{ user, setUser }}>
              <Routes>

                <Route exact path="/" element={<App />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/signin" element={<SignIn />} />
                <Route exact path="/account/:id" element={<Account />} />
                <Route exact path="/settlement/:id" element={<Settlement />} />
                <Route exact path="/playerview/:id" element={<SettlementPlayer />} />
              </Routes>
            </AppContext.Provider>
          </Box>
          <Footer />
        </ThemeProvider>
      </React.StrictMode>
    </Router>

  );
}

const routing = (<RootComponent />);
ReactDOM.render(routing, document.getElementById("root"));
