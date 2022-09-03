import React, { useState, useEffect } from "react";
import AxiosInstance from "../Axios";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  let navigate = useNavigate();

  useEffect(() => {
    const response = AxiosInstance.post("auth/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    AxiosInstance.defaults.headers["Authorization"] = null;
    navigate("/signin");
  });
  return <div>Logout</div>;
}
