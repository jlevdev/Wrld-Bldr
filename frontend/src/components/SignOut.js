import React, { useState, useEffect, useContext } from "react";
import AxiosInstance from "../Axios";
import { useNavigate } from "react-router-dom";
import AppContext from "./Context/AppContext";
import { AUTH_TOKEN_STORAGE, REFRESH_TOKEN_STORAGE } from "../Constants";

export default function SignOut() {
  let navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);

  useEffect(() => {
    const response = AxiosInstance.post("auth/blacklist/", {
      refresh_token: localStorage.getItem(REFRESH_TOKEN_STORAGE),
    });
    localStorage.removeItem(AUTH_TOKEN_STORAGE);
    localStorage.removeItem(REFRESH_TOKEN_STORAGE);
    AxiosInstance.defaults.headers["Authorization"] = null;
    setUser(false);
    navigate("/signin");
  });
  return <div>Logout</div>;
}
