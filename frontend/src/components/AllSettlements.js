import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "./Context/AppContext";

function AllSettlements() {
  let navigate = useNavigate();
  const { user } = useContext(AppContext);

  return (
    <div id="AllSettlements">
      <Container sx={{ paddingTop: "35vh" }}>
        <Box display="flex" justifyContent="center" sx={{}}>
          {(user && (
            <Box>
              <Typography>{user.username}'s Settlements</Typography>
            </Box>
          )) ||
            (!user && <></> && navigate("/signin"))}
        </Box>
      </Container>
    </div>
  );
}

export default AllSettlements;
