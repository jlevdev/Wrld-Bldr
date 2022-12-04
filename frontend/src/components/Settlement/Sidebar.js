import usePaper from "hooks/usePaper";
import { useRef } from "react";
import styled from "styled-components";
useRef;

const Styled = {};

Styled.Container = styled.div`
  display: flex;
`;

Styled.SideBarNav = styled.div`
  display: flex;
`;

Styled.NavItem = styled.span``;

Styled.Collapse = styled.ul``;

Styled.CollapseItem = styled.li``;

Styled.SideBarName = styled.span``;

Styled.SideBarIcon = styled.span``;

Styled.NPCList = styled.ul``;

Styled.NPCItem = styled.li``;

function Sidebar() {
  const { activeSettlement } = usePaper();
  const locationsRef = useRef(null);
  const optionsRef = useRef(null);

  const handleCollapseClick = () => {};

  /**
 * 

        {activeSettlement.locations.map((s, index) => {
          return (
            <Styled.CollapseItem
              className="shop"
              onClick={(e) => {
                //differentiates between npc clicks and town clicks
                if (e.target.className == "sb-name") {
                  s.startOnMouseDown();
                }
              }}
              onMouseEnter={s.startHover}
              onMouseLeave={s.endHover}
              key={index}
            >
              <Styled.SideBarName>
                {" "}
                <Styled.SideBarIcon color={s.district.color} />
                {s.locationData.name}{" "}
              </Styled.SideBarName>
              <Styled.NPCList>
                {s.npcs.map((n, i) => {
                  return (
                    <Styled.NPCItem
                      key={i}
                      onClick={() => {
                        setActiveShop(s);
                        setActiveNPC(n);
                      }}
                    >
                      {n.name}
                    </Styled.NPCItem>
                  );
                })}
              </Styled.NPCList>
            </Styled.CollapseItem>
          );
        })}
 * 
 */

  return (
    <Styled.Container>
      <Styled.SideBarNav>
        <Styled.NavItem
          className={"sidebar-locations"}
          onClick={handleCollapseClick}
          ref={locationsRef}
        >
          Locations
        </Styled.NavItem>
        <Styled.NavItem
          className={"sidebar-options"}
          onClick={handleCollapseClick}
          ref={optionsRef}
        >
          Options
        </Styled.NavItem>
      </Styled.SideBarNav>
      <Styled.Collapse></Styled.Collapse>
    </Styled.Container>
  );
}

export default Sidebar;
