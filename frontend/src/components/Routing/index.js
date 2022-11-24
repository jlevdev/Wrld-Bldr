import React from "react";
import { Route, Routes } from "react-router-dom";
import Account from "components/Account";
import SettlementGuest from "components/SettlementGuest";
import Settlement from "components/Settlement";
import LandingPage from "components/LandingPage";
import LoginPage from "components/LoginPage";
import Register from "components/Register";
import ProtectedRoute from "./ProtectedRoute";

function Routing() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/playerview" element={<SettlementGuest />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route exact path="/account" element={<Account />} />
        <Route exact path="/settlement/:id" element={<Settlement />} />
      </Route>

    </Routes>
  );
}

export default Routing;