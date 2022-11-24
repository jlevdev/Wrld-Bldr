import React, { useContext } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";


const LoginButton = (props) => {
  const { text } = props;
  const navigate = useNavigate();

  return <Button onClick={() => navigate('/login')}>{text ?? "Login"}</Button>;
};

export default LoginButton;
