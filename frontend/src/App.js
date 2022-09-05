import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { styled } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AppContext from "./components/Context/AppContext";

import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Account from "./components/Account";
import AllSettlements from "./components/AllSettlements";
import SettlementPlayer from "./components/SettlementPlayer";
import Settlement from "./components/Settlement";
import LandingPage from "./components/LandingPage";
import AxiosInstance from "./Axios";
import { AUTH_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from "./Constants";
import SignOut from "./components/SignOut";

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

  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN_STORAGE)) {
      AxiosInstance.get("/auth/user/me/").then((res) => {
        setUser({ email: res.data.email, username: res.data.username });
      });
    }
  }, []);

  const redirectIfNotAuthenticated = () => {
    if (!localStorage.getItem(AUTH_TOKEN_STORAGE)) {
      navigate("/signin");
    }
  };

  const redirectIfAuthenticated = () => {
    if (localStorage.getItem(AUTH_TOKEN_STORAGE)) {
      navigate("/all-settlements");
    }
  };

  return (
    <React.StrictMode>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={{ user, setUser }}>
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
                  path="/signin"
                  element={<SignIn />}
                  onEnter={redirectIfAuthenticated}
                />
                <Route exact path="/signout" element={<SignOut />} />
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
                  path="/playerview/:id"
                  element={<SettlementPlayer />}
                />
              </Routes>
            </Responsive>
          </Box>
          <Footer />
        </AppContext.Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
