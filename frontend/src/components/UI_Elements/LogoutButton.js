import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "./Button";

const LogoutButton = (props) => {
  const { text } = props;
  const { logout } = useAuth0();

  return (
    <Button onClick={() => logout({ returnTo: window.location.origin })}>
      {text ?? "Logout"}
    </Button>
  );
};

export default LogoutButton;
