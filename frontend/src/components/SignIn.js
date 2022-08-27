import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";

function SignIn() {
  let navigate = useNavigate();

  const initialFormData = Object.freeze({
    username: "",
    password: "",
  });

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      //trimming and white space
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axiosInstance
      .post("token/", {
        username: formData.email,
        password: formData.password,
      })
      .then((res) => {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token')
        navigate("/all-settlements/");
      });
  };


  return (
    <div id="SignIn">
      <Container sx={{ paddingTop: "30vh" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            margin: "0 auto",
            textAlign: "center",
            borderRadius: "2%",
            width: "fit-content",
            p: 2,
          }}
        >
          <form>
            <Grid
              container
              rowSpacing={2}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <Typography variant="h3">Sign In</Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default SignIn;
