import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

function AllSettlements() {
  let navigate = useNavigate();

  return (
    <div id="AllSettlements">
      <Container sx={{ paddingTop: "35vh" }}>
        <Box display="flex" justifyContent="center" sx={{}}>
          <Box>
            <Typography> Settlements</Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default AllSettlements;
