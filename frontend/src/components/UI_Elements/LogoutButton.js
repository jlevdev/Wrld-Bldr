import React, { useContext } from "react";
import Button from "./Button";
import AuthContext from "context/AuthContext";

const LogoutButton = (props) => {
  const { text } = props;
  const { logout } = useContext(AuthContext);


  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      {text ?? "Logout"}
    </Button>
  );
};

export default LogoutButton;
