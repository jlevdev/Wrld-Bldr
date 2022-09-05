import React from "react";
import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { useEffect, useState, useContext } from "react";
import AppContext from "../Context/AppContext";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useContext(AppContext);

  let navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar position="static" color="white" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "primary",
                },
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              WrldBldr
            </Typography>
          </Box>
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
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={async (e) => {
                    handleClose(e);
                    navigate(`/all-settlements`);
                  }}
                >
                  My Settlements
                </MenuItem>
                <MenuItem
                  onClick={async (e) => {
                    handleClose(e);
                    navigate(`/account`);
                  }}
                >
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={async (e) => {
                    handleClose(e);
                    navigate(`/signout`);
                  }}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </div>
          )}
          {!user && (
            <Box
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
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
