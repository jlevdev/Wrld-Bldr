import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";


function Settlement() {
    let navigate = useNavigate();

    return (
        <div id="Settlement">
            <Box sx={{ background: '#FF0000' }}>
                <Typography variant="h1">Loaded</Typography>
            </Box>
        </div>
    );
}

export default Settlement;
