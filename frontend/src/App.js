import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettlementLoadingComponent from "./components/SettlementLoading";
import Settlement from "./components/Settlement";

const Responsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("md")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("lg")]: { ".wb-logo": { width: "40vw" } },
}));

function App() {
  const navigate = useNavigate();
  const SettlementLoading = SettlementLoadingComponent(Settlement);
  const [appState, setAppState] = useState({
    loading: false,
    settlements: null
  });

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


  useEffect(() => {
    setAppState({ loading: true });

    const apiURL = 'http://localhost:8000/api/settlement/';

    fetch(apiURL).then((data) => data.json()).then((settlements) => {
      console.log(settlements)
      setAppState({ loading: false, settlements: settlements })
    })
  }, [setAppState]);

  function renderAppContent(signedIn) {
    if (signedIn) {
      return (
        <Container sx={{ paddingTop: '35vh' }}>
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              "& img": {
                mb: 3,
                width: "70vw",
              },
            }}
          >
            {" "}
            <img
              src="https://i.ibb.co/ZmFFp51/Untitled.png"
              alt=""
              className="wb-logo"
            />{" "}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            sx={{
              "& button + button": {
                ml: 1,
              },
            }}
          >
            <Button
              variant="contained"
              onClick={async () => {
                navigate(`/register`);
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Container>
      )
    } else {
      return (
        <SettlementLoading isLoading={appState.loading} settlements={appState.settlements} />
      )
    }
  }

  return (
    <div id="App">
      <Responsive>
        {renderAppContent(false)}
      </Responsive>
    </div>
  );
}

export default App;
