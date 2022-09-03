import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { useEffect, useState, useContext } from "react";
import AppContext from "../Context/AppContext";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';



const HeaderResponsive = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: { h6: { color: red[500] } },
  [theme.breakpoints.up("md")]: { h6: { color: green[500] } },
}));

function Header() {
  const [w, setW] = useState(window.innerWidth);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(AppContext);

  console.log(w)

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {

  }

  const handleMenu = () => {

  }

  return (
    <>
      <HeaderResponsive>
        <AppBar position="static" color="white" elevation={0}>
          <Toolbar>
            <Typography variant="h6" color="secondary" noWrap>
              WrldBldr
            </Typography>
            {user && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </HeaderResponsive>
    </>
  );
}

export default Header;
