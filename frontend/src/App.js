import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";

const Responsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("md")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("lg")]: { ".wb-logo": { width: "40vw" } },
}));

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
    <div id="App">
      <Responsive>
        <Box
          sx={{
            width: 1,
            height: "100vh",
            backgroundImage:
              "url(https://wallpaperaccess.com/full/1399270.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            paddingTop: "30vh",
          }}
        >
          <Container>
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                "& img": {
                  mb: 10,
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
              <Button variant="contained">Create</Button>
              <Typography
                variant="h6"
                align="center"
                color="textPrimary"
                sx={{ marginLeft: "1em", marginRight: "1em", display: "block" }}
              >
                -----
              </Typography>
              <Button variant="contained">Sign Up</Button>
            </Box>
          </Container>
        </Box>
      </Responsive>
    </div>
  );
}

export default App;
