import Panel from "components/Panel";
import Button from "components/UI_Elements/Button";
import React from "react";
import { useCallback } from "react";
import usePaper from "hooks/usePaper";
import Input from "components/UI_Elements/Input";

function SettlementCreate() {
  const titleRef = useRef(null);
  const seedRef = useRef(null);

  const handleClick = useCallback(() => {
    const { createAndDrawNewSettlement } = usePaper();
    createAndDrawNewSettlement({ 'name': titleRef.current.value, 'seed': seedRef.current.value });
  }, [titleRef, seedRef]);

  return (
    <div id="SettlementCreate">
      <Panel>
        <Input type={"text"} ref={titleRef} />
        <Input type={"number"} ref={seedRef} />
        <Button onClick={handleClick}>Create</Button>
      </Panel>
    </div>
  );
}

export default SettlementCreate;
