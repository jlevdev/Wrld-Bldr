import React from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";


const RouteButton = (props) => {
  const { text, route } = props;
  const navigate = useNavigate();

  return <Button onClick={() => navigate(route)}>{text ?? "Button"}</Button>;
};

export default RouteButton;
