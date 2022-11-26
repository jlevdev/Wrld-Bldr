import Panel from "components/Panel";
import Button from "components/UI_Elements/Button";
import React, { useContext } from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "hooks/UseAxios";

function SettlementCreate() {
  let navigate = useNavigate();
  const axios = useAxios();

  const handleClick = useCallback(() => {
    axios
      .post("/settlment/", {
        firstName: "Fred",
        lastName: "Flintstone",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  return (
    <div id="SettlementCreate">
      <Panel>
        <Button onClick={handleClick}>Create</Button>
      </Panel>
    </div>
  );
}

export default SettlementCreate;
