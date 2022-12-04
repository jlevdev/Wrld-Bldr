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
`;

Styled.ShopTypeTitle = styled.span``;

Styled.ShopFinances = styled.div``;

Styled.NPCPortraits = styled.div`
  display: flex;
`;

Styled.CoinInput = styled(Input)`
  margin-right: 10px;
  min-width: 40px;
  max-width: 100px;
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

  return (
    activeShop && (
      <Styled.Container>
        <Styled.ShopContainer>
          <Heading size={3}>
            {activeShop.name}
            <Styled.ShopTypeTitle>
              {activeShop.fiscalStatus} {activeShop.type}
            </Styled.ShopTypeTitle>
            <Styled.ShopFinances>
              <i>gold &nbsp;</i>
              <Styled.CoinInput
                onChange={handleInputChange}
                className="gold-counter"
                type="number"
                defaultValue={activeShop.cash.gold}
              />

              <i>silver &nbsp;</i>
              <Styled.CoinInput
                onChange={handleInputChange}
                className="silver-counter"
                type="number"
                defaultValue={activeShop.cash.silver}
              />

              <i>copper &nbsp;</i>
              <Styled.CoinInput
                onChange={handleInputChange}
                className="copper-counter"
                type="number"
                defaultValue={activeShop.cash.copper}
              />
            </Styled.ShopFinances>
          </Heading>
        </Styled.ShopContainer>
        <Styled.NPCPortraits>
          {activeShop.npcs.map((n, i) => {
            return (
              <span
                onClick={() => {
                  setActiveNPC(n);
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
