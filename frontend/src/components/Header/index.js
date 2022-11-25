import React, { useContext } from "react";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Styled = {};

Styled.Header = styled.header`
  background: ${props => props.theme.colors.monochrome.slate};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: 0 0 25px 0 black;
  justify-content: center;
  z-index: 1;

`;

styled.Nav = styled.nav`
  height: 100%;
`;

styled.List = styled.ul`
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
`;

Styled.li = styled.li`
  padding: 0 40px;
  display: inline;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  background: rgba(255,255,255,0);

  &:hover {
    background: rgba(255,255,255,.7);
    cursor: pointer;
  }

  &:hover * {
    color: ${props => props.theme.colors.monochrome.black};
  }
`;

Styled.link = styled(Link)`
  text-decoration: none;
  font-family: ${props => props.theme.fontFamily.primary};
  font-size: ${props => props.theme.fontSizes.p1};
  color: ${props => props.theme.colors.primary.main};
  font-weight: 600;
  transition: 0.3s;
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
  const { user } = useContext(AuthContext);

  return (
    <Styled.Header>
      <styled.Nav>
        <styled.List>
          <MenuItem text={"Home"} route={"/"} />
          {user &&
            <>
              <MenuItem text={"Create"} route={"/create"} />
              <MenuItem text={"Account"} route={"/account"} />
            </>
          }
        </styled.List>
      </styled.Nav>
    </Styled.Header>
  );
}

export default Header;
