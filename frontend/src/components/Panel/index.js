import styled, { css } from "styled-components";
import React, { useCallback } from "react";

const Styled = {};

Styled.Panel = styled.div`
  background: ${(props) => props.theme.colors.monochrome.offWhite};
  font-family: ${(props) => props.theme.fontFamily.primary};
  font-size: ${(props) => props.theme.fo};
  border: 2px solid ${(props) => props.theme.colors.primary.main};
  border-radius: 4px;
  padding: 40px;
  width: fit-content;

  display: flex;
  justify-content: center;
`;
export const Panel = styled((props) => {
  const { className, children } = props;
  return (
    <>
      <Styled.Panel className={className}>{children}</Styled.Panel>
    </>
  );
})``;

export default Panel;
