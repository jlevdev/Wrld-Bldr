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
import AxiosInstance from "../Axios";

function Register() {
  let navigate = useNavigate();

  const initialFormData = Object.freeze({
    email: "",
    username: "",
    password: "",
    password2: "",
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

    AxiosInstance.post("auth/register/", {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      password2: formData.password2,
    }).then((res) => {
      navigate("/signin/");
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
          <form noValidate>
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
                  id="username"
                  name="username"
                  label="Username"
                  type="ematextil"
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
                <TextField
                  id="password2"
                  name="password2"
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
