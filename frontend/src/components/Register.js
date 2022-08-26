import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();

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
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password-input"
                  name="password"
                  label="Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item>
                <TextField
                  id="password-input"
                  name="password"
                  label="Confirm Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit">
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
