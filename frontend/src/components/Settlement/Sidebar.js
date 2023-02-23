import usePaper from "hooks/usePaper";
import React, { Fragment, useRef } from "react";
import styled from "styled-components";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
  flex-direction: column;
`;

Styled.SideBarNav = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
`;

Styled.NavItem = styled.span`
  padding: 10px;
  width: 100%;
  background: ${(props) => props.theme.colors.primary.darker};
  color: white;
  text-align: center;

  &.selected {
    border-bottom: solid 3px ${(props) => props.theme.colors.primary.dark};
  }

  .selected {
    border: 2px solid black;
  }

  :hover {
    cursor: pointer;
    color: black;
    background: ${(props) => props.theme.colors.primary.dark};
  }

  :active {
    opacity: 0.9;
  }
`;

Styled.Collapse = styled.ul`
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
  display: flex;
  flex-direction: column;
  height: 576px;
  width: 240px;
  border-top: 15px solid ${(props) => props.theme.colors.monochrome.slategrey};
  border-bottom: 15px solid
    ${(props) => props.theme.colors.monochrome.slategrey};
`;

Styled.CollapseItem = styled.li`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid ${(props) => props.theme.colors.monochrome.slategrey};
`;

Styled.SideBarName = styled.span`
  width: 100%;
  padding: 10px 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-left: 2px solid #00000000;

  &:hover {
    background: ${(props) => props.color};
    border-left: 2px solid ${(props) => props.theme.colors.primary.dark};
  }
`;

Styled.NPCItem = styled.span`
  width: 100%;
  padding: 10px 10px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  border-left: 2px solid #00000000;

  &:before {
    content: " > ";
  }

  &:hover {
    background: ${(props) => props.color};
    border-left: 2px solid ${(props) => props.theme.colors.primary.dark};
  }
`;

const Sidebar = React.memo(() => {
  const { locationShopRelations, setActiveShop } = usePaper();
  const locationsRef = useRef(null);
  const optionsRef = useRef(null);

  const handleCollapseClick = (e) => {};

  return (
    <Styled.Container>
      <Styled.SideBarNav>
        <Styled.NavItem
          className={"sidebar-locations selected"}
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
      <Styled.Collapse>
        {locationShopRelations.map((s) => {
          return (
            <Fragment key={s.location.id}>
              {" "}
              {s.district && (
                <Styled.CollapseItem
                  className="shop"
                  onClick={() => {
                    setActiveShop(s);
                  }}
                  onMouseEnter={s.startHover}
                  onMouseLeave={s.endHover}
                >
                  <Styled.SideBarName color={s.district.color}>
                    {s.location.name}
                  </Styled.SideBarName>

                  {s.location.npcs.map((n, i) => {
                    return (
                      <Styled.NPCItem
                        key={n.id}
                        color={s.district.color}
                        onClick={() => {
                          //TODO implement
                          setActiveShop(s);
                          //setActiveNPC(n);
                        }}
                      >
                        {n.name}
                      </Styled.NPCItem>
                    );
                  })}
                </Styled.CollapseItem>
              )}
            </Fragment>
          );
        })}
      </Styled.Collapse>
    </Styled.Container>
  );
});

export default Sidebar;
