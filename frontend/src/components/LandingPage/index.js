import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

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
          {!false ? (<Typography>Not signed in</Typography>) :
            (
              <>
                <Typography>signed in</Typography>
              </>
            )}
        </Box>
      </Container>
    );
  }

  return <>{renderContent()}</>;
}

export default LandingPage;
