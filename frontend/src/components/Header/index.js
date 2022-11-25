import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const Styled = {};

Styled.Header = styled.header`
  background: rgba{255,255,255, 1};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 25px 0 black;

  z-index: 1;

  & * {
    display: inline;
  }
`;

Styled.Nav = styled.nav`
  
`;

Styled.Menu = styled.ul`
  
`;

Styled.li = styled.li`
  margin: 20px;
`;

Styled.link = styled(Link)`
  color: black;
  text-decoration: none;
`;

function MenuItem(props) {
  const { text, route } = props;
  return (
    <Styled.li>
      <Styled.link to={route}>
        {text}
      </Styled.link>
    </Styled.li>
  );
}

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  let navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Styled.Header>
      <nav>
        <ul>
          <MenuItem text={"Home"} route={"/"} />
          <MenuItem text={"Create"} route={"/"} />
          <MenuItem text={"Account"} route={"/account"} />
        </ul>
      </nav>
    </Styled.Header>
  );
}

export default Header;
