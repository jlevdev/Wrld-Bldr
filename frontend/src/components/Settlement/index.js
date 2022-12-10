import Panel from "components/Panel";
import Paper from "components/Paper";
import Heading from "components/UI_Elements/Heading";
import usePaper from "hooks/usePaper";
import React, { useEffect } from "react";
import styled from "styled-components";
import InfoHeader from "./InfoHeader";
import InventoryPanel from "./InventoryPanel";
import NPCPanel from "./NPCPanel";
import Sidebar from "./Sidebar";

const Styled = {};

Styled.Panel = styled(Panel)`
  padding: 0;
  margin: 0 auto;
`;

Styled.Container = styled.div`
  display: flex;
  flex-direction: column;
`;

Styled.Header = styled.div`
  padding: 10px;
`;

Styled.TopContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

Styled.InfoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

Styled.PaperContainer = styled.div`
  border: 3px solid ${(props) => props.theme.colors.monochrome.slategrey};
  border-left: none;
  background: ${(props) => props.theme.colors.monochrome.slategrey};
`;

const Settlement = React.memo(() => {
  const { activeSettlement, drawExistingSettlement } = usePaper();

  useEffect(() => {
    //debug
    if (!activeSettlement) drawExistingSettlement(96);
  }, [activeSettlement]);

  return (
    activeSettlement && (
      <Styled.Panel>
        <Styled.Container>
          <Styled.Header>
            <Heading size={2}>{activeSettlement.name}</Heading>
          </Styled.Header>
          <Styled.TopContainer>
            <Styled.PaperContainer>
              <Paper />
            </Styled.PaperContainer>
            <Sidebar />
          </Styled.TopContainer>
          <Styled.InfoContainer>
            <InfoHeader />
            <NPCPanel />
            <InventoryPanel />
          </Styled.InfoContainer>
        </Styled.Container>
      </Styled.Panel>
    )
  );
});

export default Settlement;
