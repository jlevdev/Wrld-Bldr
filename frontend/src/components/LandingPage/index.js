import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";
import SignIn from "../SignIn";

function LandingPage() {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  function renderContent() {
    return (
      <Container sx={{ paddingTop: "35vh" }}>
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
        <Box display="flex" justifyContent="center">
          {(!user && <Typography>Not signed in</Typography>) ||
            (user && (
              <>
                <Typography>signed in</Typography>
              </>
            ))}
        </Box>
      </Container>
    );
  }

  return <>{renderContent()}</>;
}

export default LandingPage;
