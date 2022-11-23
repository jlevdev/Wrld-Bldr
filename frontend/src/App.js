import React, { useState, useEffect } from "react";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styled, { ThemeProvider } from "styled-components";
import { Auth0Provider } from "@auth0/auth0-react";
import Routing from "./components/Routing";
import { theme } from "theme";
const Styled = {};

Styled.WallpaperBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background-image: url(https://wallpaperaccess.com/full/1399270.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

function App() {
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
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <Auth0Provider
          domain="dev-dtp9c6a7.us.auth0.com"
          clientId="3WN7Z4GU9LU9CFsqjpzZla4uOZZQDQNe"
          redirectUri={window.location.origin}
        >
          <Styled.WallpaperBackground>
            <Routing />
          </Styled.WallpaperBackground>
        </Auth0Provider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
