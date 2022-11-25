import styled, { css } from "styled-components";
import React, { useCallback } from "react";

const Styled = {};

Styled.Button = styled.button`
  align-items: center;
  appearance: none;
  background-color: ${props => props.theme.colors.monochrome.black};
  border-radius: 4px;
  border: solid 2px ${props => props.theme.colors.primary.dark};
  box-sizing: border-box;
  color: ${props => props.theme.colors.primary.dark};
  cursor: pointer;
  display: inline-flex;
  font-family: ${props => props.theme.fontFamily.primary};
  font-size: .875rem;
  font-weight: 500;
  height: 36px;
  justify-content: center;
  letter-spacing: .0892857em;
  line-height: normal;
  min-width: 64px;
  outline: none;
  overflow: visible;
  padding: 0 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: box-shadow 280ms cubic-bezier(.4, 0, .2, 1);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  will-change: transform,opacity;

  &:hover {
    background-color: ${props => props.theme.colors.monochrome.slate};
  }

  &:disabled {
    background-color: rgba(0, 0, 0, .12);
    color: rgba(0, 0, 0, .37);
    cursor: default;
    pointer-events: none;
  }

  &:active {
    border-color: ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.primary.main};
  }

`;

export const Button = styled(
  React.memo(
    React.forwardRef(
      (
        {
          children,
          className,
          style,
          disabled,
          busy,
          color,
          id,
          onClick,
          ...restProps
        },
        ref
      ) => {
        const handleClick = useCallback(
          (e) => {
            onClick({ event: e, id, restProps });
          },
          [onClick, id, restProps]
        );
        return (
          <>
            <Styled.Button
              ref={ref}
              className={className}
              style={style}
              color={color}
              disabled={disabled || busy}
              onClick={handleClick}
            >
              {children}
            </Styled.Button>
          </>
        );
      }
    )
  )
)``;

export default Button;
