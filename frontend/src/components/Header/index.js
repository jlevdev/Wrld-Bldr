import React from "react";
import LoginButton from "../UI_Elements/LoginButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";

const Styled = {};

Styled.AppBar = styled.div``;

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, isAuthenticated, isLoading } = useAuth0();

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
          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user.picture ? (
                  <Box
                    component="img"
                    sx={{
                      borderRadius: "50%",
                      width: "24px",
                    }}
                    referrerpolicy="no-referrer"
                    src={user.picture}
                  />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
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
                <MenuItem>
                  <LogoutButton />
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Box
              sx={{
                "& button + button": {
                  ml: 1,
                },
              }}
            >
              <LoginButton />
              <LoginButton text="Sign Up" />
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
