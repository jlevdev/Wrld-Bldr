import Panel from "components/Panel";
import Button from "components/UI_Elements/Button";
import Heading from "components/UI_Elements/Heading";
import Input from "components/UI_Elements/Input";
import usePaper from "hooks/usePaper";
import { useCallback, useRef } from "react";
import styled from "styled-components";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20vh;
`;

Styled.Heading = styled(Heading)`
  margin-bottom: 10px!important;
`;

Styled.Panel = styled(Panel)`
  flex-direction: column;
`;

function SettlementCreate() {
  const titleRef = useRef(null);
  const seedRef = useRef(null);
  const { createAndDrawNewSettlement } = usePaper();

  const handleClick = useCallback(() => {
    createAndDrawNewSettlement({ 'name': titleRef.current.value, 'mapData': { 'seed': seedRef.current.value } });
  }, [titleRef, seedRef]);

  return (
    <Styled.Container>
      <Styled.Panel>
        <Styled.Heading size={3}>Create a New Settlement</Styled.Heading>
        <Input type={"text"} placeholder={"Title"} defaultValue={"TEST_CITY_" + (Math.floor(Math.random() * 999999) + 1)} ref={titleRef} />
        <Input type={"number"} placeholder={"Seed"} defaultValue={parseInt(Date.now().toString().substr(-5))} ref={seedRef} />
        <Button onClick={handleClick}>Create</Button>
      </Styled.Panel>
    </Styled.Container>
  );
}

export default SettlementCreate;
