import { Box, Button, Container, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  let navigate = useNavigate();

  return (
    <div id="SignIn">
      <Container sx={{ paddingTop: "35vh" }}></Container>
    </div>
  );
}

export default SignIn;
