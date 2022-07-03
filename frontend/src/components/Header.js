import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { useEffect, useState } from "react";

const HeaderResponsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { h6: { color: red[500] } },
  [theme.breakpoints.up("md")]: { h6: { color: green[500] } },
}));

function Header() {
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
    <>
      <HeaderResponsive>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              WrldBldr
            </Typography>
          </Toolbar>
        </AppBar>
      </HeaderResponsive>
    </>
  );
}

export default Header;
