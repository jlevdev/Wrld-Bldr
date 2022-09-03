import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

function Settlement() {
    let navigate = useNavigate();
    return (
        <div id="Settlement">
            <Box sx={{ background: '#FF0000' }}>
                <Typography variant="h1">lol</Typography>
            </Box>
        </div>
    );
}

export default Settlement;
