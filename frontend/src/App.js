import React, { useState, useEffect } from "react";
import "./index.css";
import { styled } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import AllSettlements from "./components/AllSettlements";
import SettlementPlayer from "./components/SettlementPlayer";
import Settlement from "./components/Settlement";
import LandingPage from "./components/LandingPage";
import Logout from "./components/Logout";
import { Auth0Provider } from "@auth0/auth0-react";


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

function App() {
  const [user, setUser] = useState(null);

  const [w, setW] = useState(window.innerWidth);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const redirectIfNotAuthenticated = () => {

  };

  const redirectIfAuthenticated = () => {

  };

  return (
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Auth0Provider
          domain="dev-dtp9c6a7.us.auth0.com"
          clientId="3WN7Z4GU9LU9CFsqjpzZla4uOZZQDQNe"
          redirectUri={'localhost/'}
        >
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
              <Routes>
                <Route exact path="/" element={<LandingPage />} />
                <Route
                  exact
                  path="/register"
                  element={<Register />}
                  onEnter={redirectIfAuthenticated}
                />
                <Route
                  exact
                  path="/login"
                  element={<Login />}
                  onEnter={redirectIfAuthenticated}
                />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/account" element={<Account />} />
                <Route
                  exact
                  path="/settlement/:id"
                  element={<Settlement />}
                  onEnter={redirectIfNotAuthenticated}
                />
                <Route
                  exact
                  path="/all-settlements"
                  element={<AllSettlements />}
                  onEnter={redirectIfNotAuthenticated}
                />
                <Route
                  exact
                  path="/playerview"
                  element={<SettlementPlayer />}
                />
              </Routes>
            </Responsive>
          </Box>
          <Footer />
        </Auth0Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
