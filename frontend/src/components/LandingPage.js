import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Responsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("md")]: { ".wb-logo": { width: "50vw" } },
  [theme.breakpoints.up("lg")]: { ".wb-logo": { width: "40vw" } },
}));

function LandingPage() {
  const navigate = useNavigate();

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
    <div id="LandingPage">
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
            paddingTop: "35vh",
          }}
        >
          <Container>
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
        </Box>
      </Responsive>
    </div>
  );
}

export default LandingPage;
