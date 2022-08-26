import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { styled } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AppContext from "./AppContext";

import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Account from "./components/Account";
import AllSettlements from "./components/AllSettlements";
import SettlementPlayer from "./components/SettlementPlayer";
import Settlement from "./components/Settlement";
import { func } from "prop-types";
import LandingPage from "./components/LandingPage";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontFamily: "PT Sans",
    },
    h2: {
      fontFamily: "PT Sans",
    },
    h3: {
      fontFamily: "PT Sans",
    },
    h4: {
      fontFamily: "PT Sans",
    },
    h5: {
      fontFamily: "PT Sans",
    },
    h6: {
      fontFamily: "PT Sans",
    },
  },
  palette: {
    primary: {
      main: "#42FFFF",
      dark: "#1FC1C1",
      darker: "#097474",
    },
    secondary: {
      main: "#202028",
    },
    white: {
      main: "#DADADA",
    },
    background: {
      main: "#DADADA",
    },
  },
});

const Responsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("md")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("lg")]: { ".wb-logo": { width: "40vw" } },
}));

function RootComponent() {
  const [user, setUser] = useState({ username: "jame" });

  const [w, setW] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
            <Responsive>
              <AppContext.Provider value={{ user, setUser }}>
                <Routes>
                  <Route exact path="/" element={<LandingPage />} />
                  <Route exact path="/register" element={<Register />} />
                  <Route exact path="/signin" element={<SignIn />} />
                  <Route exact path="/account/:id" element={<Account />} />
                  <Route
                    exact
                    path="/settlement/:id"
                    element={<Settlement />}
                  />
                  <Route
                    exact
                    path="/playerview/:id"
                    element={<SettlementPlayer />}
                  />
                </Routes>
              </AppContext.Provider>
            </Responsive>
          </Box>
          <Footer />
        </ThemeProvider>
      </React.StrictMode>
    </Router>
  );
}

const routing = <RootComponent />;
ReactDOM.render(routing, document.getElementById("root"));
