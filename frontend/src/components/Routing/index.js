import React from "react";
import { Route, Routes } from "react-router-dom";
import Account from "components/Account";
import UserSettlements from "components/UserSettlements";
import SettlementGuest from "components/SettlementGuest";
import Settlement from "components/Settlement";
import LandingPage from "components/LandingPage";

function Routing() {
  return (
    <Routes>
      <Route exact path="/" element={<LandingPage />} />
      <Route exact path="/account" element={<Account />} />
      <Route exact path="/settlement/:id" element={<Settlement />} />
      <Route exact path="/my-settlements" element={<UserSettlements />} />
      <Route exact path="/playerview" element={<SettlementGuest />} />
    </Routes>
  );
}

export default Routing;
