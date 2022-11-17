import styled, { css } from "styled-components";
import React, { useCallback } from "react";

const Styled = {};

Styled.CLASSNAME = styled.div``;

export const CLASSNAME = styled(
  React.memo(
    React.forwardRef(
      ({ children, className, style, id, onClick, ...restProps }, ref) => {
        const handleClick = useCallback(
          (e) => {
            onClick({ event: e, id, restProps });
          },
          [onClick, id, restProps]
        );
        return (
          <>
            <Styled.CLASSNAME
              className={className}
              style={style}
              onClick={handleClick}
            >
              {children}
            </Styled.CLASSNAME>
          </>
        );
      }
    )
  )
)``;

export default CLASSNAME;
