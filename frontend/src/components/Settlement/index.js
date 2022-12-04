import Panel from "components/Panel";
import Paper from "components/Paper";
import usePaper from "hooks/usePaper";
import { useEffect } from "react";
import styled from "styled-components";
import InfoHeader from "./InfoHeader";
import InventoryPanel from "./InventoryPanel";
import NPCPanel from "./NPCPanel";
import Sidebar from "./Sidebar";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
  flex-direction: column;
`;

Styled.TopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

Styled.InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

function Settlement() {
  const { activeSettlement, drawExistingSettlement } = usePaper();

  useEffect(() => {
    //debug
    if (!activeSettlement) drawExistingSettlement(40);
  }, [activeSettlement]);

  return (
    activeSettlement && (
      <Panel>
        <Styled.Container>
          <Styled.TopContainer>
            <Paper />
            <Sidebar />
          </Styled.TopContainer>
          <Styled.InfoContainer>
            <InfoHeader />
            <NPCPanel />
            <InventoryPanel />
          </Styled.InfoContainer>
        </Styled.Container>
      </Panel>
    )
  );
}

export default Settlement;
