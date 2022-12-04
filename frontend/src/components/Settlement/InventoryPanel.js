import { Autocomplete, TextField } from "@mui/material";
import usePaper from "hooks/usePaper";
import Item from "map/data/Item";
import { useState } from "react";
import styled from "styled-components";

const Styled = {};

Styled.Autocomplete = styled(Autocomplete)``;

Styled.InventoryList = styled.ul``;

Styled.InventoryListItem = styled.li``;

Styled.ItemCounter = styled.span``;

Styled.ItemControls = styled.span``;

Styled.ItemControlsPlus = styled.span``;

Styled.ItemControlsMinus = styled.span``;

function InventoryPanel() {
  const { activeShop } = usePaper();
  const [inventorySearchVal, setInventorySearchVal] = useState("");

  const addItem = (item) => {
    activeShop.addItem(item);
  };

  const removeItem = (item) => {
    activeShop.removeItem(item);
  };

  const handleSearchResultClick = (e, v, r) => {
    if (!activeShop.addItem(v)) return;

    setTimeout(() => {
      setInventorySearchVal("");
    }, 1000);
    setInventorySearchVal(v);
  };

  return (
    <>
      {activeShop && (
        <>
          <Styled.Autocomplete
            disablePortal
            options={Item.searchableItems}
            getOptionLabel={(option) => option.name}
            onInputChange={handleSearchResultClick}
            style={{ background: "white", width: "100%", margin: "0 auto" }}
            value={inventorySearchVal}
            renderInput={(params) => <TextField {...params} />}
          />
          <Styled.InventoryList>
            {this.props.activeShop.inventory.map((t, index) => {
              if (t.type == Item.SERVICE_TYPE) {
                return (
                  <li className="inv-service" key={index}>
                    {t.name} - {t.cost}
                  </li>
                );
              } else {
                if (typeof t.rarity === "object") {
                  return (
                    <Styled.InventoryListItem
                      style={{ color: t.rarity["color"] }}
                      key={index}
                    >
                      <Styled.ItemCounter className="inv-counter">
                        {" "}
                        {t.amount}{" "}
                      </Styled.ItemCounter>
                      {t.name} - {t.cost}
                      <Styled.ItemControls className="inv-controls">
                        <Styled.ItemControlsPlus
                          onClick={() => {
                            addItem(t);
                          }}
                          className="inv-plus"
                        ></Styled.ItemControlsPlus>
                        <Styled.ItemControlsMinus
                          onClick={() => {
                            removeItem(t);
                          }}
                          className="inv-minus"
                        ></Styled.ItemControlsMinus>
                      </Styled.ItemControls>
                    </Styled.InventoryListItem>
                  );
                } else {
                  return (
                    <Styled.InventoryListItem key={index}>
                      <Styled.ItemCounter className="inv-counter">
                        {" "}
                        {t.amount}{" "}
                      </Styled.ItemCounter>
                      {t.name} - {t.cost}
                      <Styled.ItemControls className="inv-controls">
                        <Styled.ItemControlsPlus
                          onClick={() => {
                            addItem(t);
                          }}
                          className="inv-plus"
                        ></Styled.ItemControlsPlus>
                        <Styled.ItemControlsMinus
                          onClick={() => {
                            removeItem(t);
                          }}
                          className="inv-minus"
                        ></Styled.ItemControlsMinus>
                      </Styled.ItemControls>
                    </Styled.InventoryListItem>
                  );
                }
              }
            })}
          </Styled.InventoryList>
        </>
      )}
    </>
  );
}

export default InventoryPanel;
