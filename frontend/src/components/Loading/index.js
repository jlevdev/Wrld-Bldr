import { Typography } from "@mui/material";
import React from "react";

function Loading(Component) {
  return ({ isLoading, ...props }) => {
    if (!isLoading) return <Component {...props} />;
    return <Typography variant="h3">Loading...</Typography>;
  };
}

export default Loading;
