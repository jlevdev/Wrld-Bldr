import Heading from "components/UI_Elements/Heading";
import Input from "components/UI_Elements/Input";
import usePaper from "hooks/usePaper";
import styled from "styled-components";

const Styled = {};

Styled.Container = styled.div`
  display: flex;
`;

Styled.ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

Styled.ShopTypeTitle = styled.span``;

Styled.ShopFinances = styled.div`
  padding: 10px;
`;

Styled.NPCPortraits = styled.div`
  display: flex;
`;

Styled.CoinContainer = styled.span`
  &.gold {
    background: ${(props) => props.theme.colors.metals.gold};
  }
  &.silver {
    background: ${(props) => props.theme.colors.metals.silver};
  }
  &.copper {
    background: ${(props) => props.theme.colors.metals.copper};
  }

  color: black;
  padding: 15px;
`;

Styled.CoinInput = styled(Input)`
  margin-right: 10px;
  min-width: 40px;
  max-width: 100px;
`;

Styled.ShopHeading = styled(Heading)`
  padding: 10px;
`;

const InfoHeader = () => {
  const { activeShop, activeNPC, setActiveNPC, updateActiveShopCash } =
    usePaper();

  const handleInputChange = (i) => {
    /**
     * TODO: this probably won't work? I will need to update state
     * TODO: how to push cash?
     */

    if (i.currentTarget.className == "gold-counter")
      activeShop.gold = parseInt(i.currentTarget.value);
    if (i.currentTarget.className == "silver-counter")
      activeShop.silver = parseInt(i.currentTarget.value);
    if (i.currentTarget.className == "copper-counter")
      activeShop.copper = parseInt(i.currentTarget.value);

    updateActiveShopCash({
      gold: activeShop.gold,
      silver: activeShop.silver,
      copper: activeShop.copper,
    });
  };
  console.log(activeShop && activeShop.location);
  return (
    activeShop && (
      <Styled.Container>
        <Styled.ShopContainer>
          <Styled.ShopHeading size={3}>
            {activeShop.location.name}
            {" - "}
            <Styled.ShopTypeTitle>
              {activeShop.location.fiscal_status}{" "}
              {activeShop.location.location_type.name}
            </Styled.ShopTypeTitle>
          </Styled.ShopHeading>
          <Styled.ShopFinances>
            <Styled.CoinContainer className="gold">
              <i>gold &nbsp;</i>
              <Styled.CoinInput
                onChange={handleInputChange}
                className="gold-counter"
                type="number"
                defaultValue={activeShop.location.gold}
              />
            </Styled.CoinContainer>

            <Styled.CoinContainer className="silver">
              <i>silver &nbsp;</i>

              <Styled.CoinInput
                onChange={handleInputChange}
                className="silver-counter"
                type="number"
                defaultValue={activeShop.location.silver}
              />
            </Styled.CoinContainer>

            <Styled.CoinContainer className="copper">
              <i>copper &nbsp;</i>
              <Styled.CoinInput
                onChange={handleInputChange}
                className="copper-counter"
                type="number"
                defaultValue={activeShop.location.copper}
              />
            </Styled.CoinContainer>
          </Styled.ShopFinances>
        </Styled.ShopContainer>
        <Styled.NPCPortraits>
          {activeShop.location.npcs.map((n, i) => {
            return (
              <span
                onClick={() => {
                  //setActiveNPC(n);
                }}
                key={i}
                style={{
                  width: 40,
                  height: 40,
                  backgroundImage: `url(${n.avatar})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></span>
            );
          })}
        </Styled.NPCPortraits>
      </Styled.Container>
    )
  );
};

export default InfoHeader;
