import styled from "styled-components";
import React from "react";
import usePaper from "hooks/usePaper";
import Panel from "components/Panel";
import Sidebar from "./Sidebar";
import InfoHeader from "./InfoHeader";
import InfoBody from "./InfoBody";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
  flex-direction: column;
`;

Styled.InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

function Settlement() {
  const { activeSettlement } = usePaper();

  return (
    <Panel>
      <Styled.Container>
        <Paper />
        <Sidebar />
        <Styled.InfoContainer>
          <InfoHeader />
          <InfoBody />
        </Styled.InfoContainer>
      </Styled.Container>
    </Panel>
  );
}

export default Settlement;
