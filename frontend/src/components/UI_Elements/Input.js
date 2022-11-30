import styled from "styled-components";
import React from "react";

const Styled = {};

Styled.Input = styled.input`
  font-family: ${(props) => props.theme.fontFamily.primary};
  font-size: ${(props) => props.theme.fontSizes.p1};
  border-radius: 4px;
  border: 1px solid #aaa;
  padding: 8px;
  margin: 0 0 10px 0;
`;

export const Input = React.memo(React.forwardRef((props, ref) => {
  const { type, ...restProps } = props;
  return <Styled.Input {...restProps} type={type} ref={ref} />;
}))

export default Input;
