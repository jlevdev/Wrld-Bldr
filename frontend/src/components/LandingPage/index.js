import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  function renderContent(signedIn) {
    if (!signedIn) {
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
                navigate(`/signin`);
              }}
            >
              Login
            </Button>
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
        <></>
            )
    }
  }

  return (
    <>
        {renderContent(false)}
    </>
  );
}

export default LandingPage;
