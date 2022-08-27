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

function Register() {
  let navigate = useNavigate();
  const initialFormData = Object.freeze({
    email: "",
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
    console.log(formData);

    axiosInstance
      .post("register/", {
        email: formData.email,
        user_name: formData.email,
        password: formData.password,
      })
      .then((res) => {
        navigate.push("/signin/");
        console.log(res, res.data);
      });
  };

  return (
    <div id="Register">
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
                <Typography variant="h3">Sign Up!</Typography>
              </Grid>
              <Grid item>
                <TextField
                  id="email-input"
                  name="email"
                  label="Email"
                  type="email"
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password-input"
                  name="password"
                  label="Password"
                  type="password"
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password-input"
                  name="password"
                  label="Confirm Password"
                  type="password"
                  required
                  onChange={handleChange}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleSubmit}
                >
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

export default Register;
