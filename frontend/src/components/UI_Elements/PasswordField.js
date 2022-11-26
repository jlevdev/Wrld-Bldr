import styled from "styled-components";
import React from "react";
import Input from "./Input";
import { Link } from "react-router-dom";

const Styled = {};

Styled.Container = styled.div`
    display: flex;
    flex-direction: column;
`;

Styled.Input = styled(Input)`
`;

Styled.ForgotPassword = styled(Link)`
  font-size: ${props => props.theme.fontSizes.small};
  color: #999;
  text-decoration: none;
  margin: 2px 0 10px auto;
  order: 2;
  
  &:hover {
    color: ${props => props.theme.colors.primary.darker};
  }
`;

export const PasswordField = (props) => {
    const { id, name, showForgotPassword = false, ...restProps } = props;
    return (
        <Styled.Container>
            <Styled.Input name={name || "password"} id={id || "password"} type={"password"} placeholder={"Password"} {...restProps} />
            {showForgotPassword &&
                <Styled.ForgotPassword to='/'>
                    forgot your password?
                </Styled.ForgotPassword>}
        </Styled.Container>
    );
};

export default PasswordField;
