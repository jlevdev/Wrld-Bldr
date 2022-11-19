import React from "react";
import LoginButton from "components/UI_Elements/LoginButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "components/UI_Elements/LogoutButton";
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

  return <></>;
}

export default Header;
