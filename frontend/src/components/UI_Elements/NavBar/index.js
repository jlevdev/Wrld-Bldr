import styled, { css } from "styled-components";
import React, { useCallback } from "react";

const Styled = {};

Styled.NavBar = styled.div``;

export const NavBar = styled(
  React.memo(
    React.forwardRef(({ children, style, id, onClick, ...restProps }, ref) => {
      return (
        <>
          <Styled.NavBar className={className} style={style}>
            {children}
          </Styled.NavBar>
        </>
      );
    })
  )
)``;

export default NavBar;
