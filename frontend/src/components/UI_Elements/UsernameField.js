import styled from "styled-components";
import React from "react";
import Input from "./Input";

const Styled = {};

Styled.Input = styled(Input)``;

export const UsernameField = (props) => {
  const { id, name } = props;
  return (
    <Styled.Input
      name={name || "username"}
      id={id || "username"}
      type={"text"}
      placeholder={"Username"}
    />
  );
};

export default UsernameField;
