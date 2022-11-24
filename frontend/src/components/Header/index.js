import React from "react";
import LoginButton from "components/UI_Elements/LoginButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "components/UI_Elements/LogoutButton";
import styled from "styled-components";

const Styled = {};

Styled.NavBar = styled.div`
  
`;

/**
 * 
 * logo
 * create
 * 
 */

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

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
