import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";

function Settlement() {
    let navigate = useNavigate();
    const { user } = useContext(AppContext);
    return (
        <div id="Settlement">
            <Box sx={{ background: '#FF0000' }}>
                <Typography variant="h1">{user.username}</Typography>
            </Box>
        </div>
    );
}

export default Settlement;
