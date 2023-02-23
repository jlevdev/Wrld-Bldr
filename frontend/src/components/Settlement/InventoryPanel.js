import { Autocomplete, TextField } from "@mui/material";
import usePaper from "hooks/usePaper";
import { Fragment, useState } from "react";
import styled from "styled-components";

const Styled = {};

Styled.Autocomplete = styled(Autocomplete)``;

Styled.InventoryGrid = styled.div`
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto auto auto;
  overflow-x: visible;
  grid-gap: 2px;
  background: ${(props) => props.theme.colors.primary.darker};
  border: 1px solid ${(props) => props.theme.colors.primary.darker};

  > div {
    background: ${(props) => props.theme.colors.monochrome.offWhite};
    padding: 15px;
  }
`;

Styled.InventoryHeader = styled.div`
  color: ${(props) => props.theme.colors.primary.darker};
`;

Styled.InventoryItem = styled.div`

  &.inv-controls {
    display: flex
    flex-direction: row;
    justify-content: space-between
  }
`;

Styled.ItemControlsPlus = styled.span``;

Styled.ItemControlsMinus = styled.span``;

function InventoryPanel() {
  const { activeShop, addItemToShop, removeItemFromShop, searchableItems } =
    usePaper();
  const [inventorySearchVal, setInventorySearchVal] = useState("");

  const getCurrencyString = (cashObj) => {
    let str = "";
    if (cashObj.copper)
      return (str +=
        cashObj.gold * 100 + cashObj.silver * 10 + cashObj.copper + " cp");
    if (cashObj.silver)
      return (str += cashObj.gold * 10 + cashObj.silver + " sp");
    if (cashObj.gold) return (str += cashObj.gold + " gp");
  };

  const addItem = (item) => {
    addItemToShop({
      shop: activeShop,
      item,
    });
  };

  const removeItem = (item) => {
    removeItemFromShop({
      shop: activeShop,
      item,
    });
  };

  const handleSearchResultClick = (e, v, r) => {
    //TODO: implement
  };

  //console.log(searchableItems);
  console.log(activeShop);

  return (
    <>
      {activeShop && (
        <>
          <Styled.Autocomplete
            disablePortal
            options={searchableItems}
            getOptionLabel={(option) => option.name}
            onInputChange={handleSearchResultClick}
            style={{ background: "white", width: "100%", margin: "0 auto" }}
            renderInput={(params) => (
              <TextField placeholder="search for items..." {...params} />
            )}
          />
          <Styled.InventoryGrid>
            <Styled.InventoryHeader>Name</Styled.InventoryHeader>
            <Styled.InventoryHeader>Quantity</Styled.InventoryHeader>
            <Styled.InventoryHeader>Cost</Styled.InventoryHeader>
            <Styled.InventoryHeader>Controls</Styled.InventoryHeader>
            {activeShop.location.items.map((t, index) => {
              const cost = getCurrencyString({
                gold: t.gold,
                silver: t.silver,
                copper: t.copper,
              });
              if (t.is_service) {
                return (
                  <li className="inv-service" key={index}>
                    {t.name} - {cost}
                  </li>
                );
              } else {
                if (typeof t.rarity === "object") {
                  return (
                    //style={{ color: t.rarity ? t.rarity["color"] : "#000" }}
                    <Fragment key={index}>
                      <Styled.InventoryItem key={index + "-name"}>
                        {t.name}
                      </Styled.InventoryItem>
                      <Styled.InventoryItem key={index + "-quantity"}>
                        {t.quantity}
                      </Styled.InventoryItem>
                      <Styled.InventoryItem key={index + "-cost"}>
                        {cost}
                      </Styled.InventoryItem>
                      <Styled.InventoryItem
                        className={"inv-controls"}
                        key={index + "-controls"}
                      >
                        <Styled.ItemControlsPlus
                          onClick={() => {
                            addItem(t);
                          }}
                          className="inv-plus"
                        >
                          {"+"}
                        </Styled.ItemControlsPlus>
                        <Styled.ItemControlsMinus
                          onClick={() => {
                            removeItem(t);
                          }}
                          className="inv-minus"
                        >
                          {"-"}
                        </Styled.ItemControlsMinus>
                      </Styled.InventoryItem>
                    </Fragment>
                  );
                }
              }
            })}
          </Styled.InventoryGrid>
        </>
      )}
    </>
  );
}

export default InventoryPanel;
