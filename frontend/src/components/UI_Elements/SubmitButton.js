import styled from "styled-components";
import React from "react";
import Button from "./Button";

const Styled = {};

Styled.SubmitButton = styled(Button)``;

export const SubmitButton = (props) => {
  const { children } = props;
  return <Styled.SubmitButton type="submit">{children}</Styled.SubmitButton>;
};

export default SubmitButton;
