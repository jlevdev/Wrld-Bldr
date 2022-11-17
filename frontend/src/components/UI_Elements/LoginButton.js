import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";

const LoginButton = (props) => {
  const { text } = props;
  const { loginWithRedirect } = useAuth0();

  return <Button onClick={() => loginWithRedirect()}>{text ?? "Login"}</Button>;
};

export default LoginButton;
