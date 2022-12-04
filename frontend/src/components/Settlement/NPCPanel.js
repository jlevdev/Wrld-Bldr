import usePaper from "hooks/usePaper";
import styled from "styled-components";

const Styled = {};

Styled.AvatarPortrait = styled.div``;

Styled.NPCName = styled.div``;

Styled.NPCTraitsList = styled.ul``;

Styled.NPCTraitsListItem = styled.li``;

function NPCPanel() {
  const { activeNPC, activeShop } = usePaper();

  return (
    <>
      {activeNPC && activeShop && (
        <>
          <Styled.AvatarPortrait />
          <Styled.NPCName>
            {activeNPC.name} - {activeNPC.profession}{" "}
          </Styled.NPCName>
          <Styled.NPCTraitsList>
            {activeNPC.traits.map((t) => {
              return (
                <Styled.NPCTraitsListItem key={t}>
                  {t.charAt(0).toUpperCase() + t.substring(1, t.length)}
                </Styled.NPCTraitsListItem>
              );
            })}
          </Styled.NPCTraitsList>
        </>
      )}
    </>
  );
}

export default NPCPanel;
