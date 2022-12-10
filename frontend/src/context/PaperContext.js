import useAxios from "hooks/UseAxios";
import Model from "map/building/Model";
import Random from "map/utils/Random";
import Ward from "map/wards/Ward";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaperContext = createContext();

export default PaperContext;

export const PaperProvider = ({ children }) => {
  const MAP_DATA_DEFAULT = { seed: 1, size: 15, shopIndexes: [] };
  const SCREEN_DEFAULT = { w: 800, h: 600 };

  const [screen, setScreen] = useState(SCREEN_DEFAULT);
  const [mapLoading, setMapLoading] = useState(true);
  const [activeSettlement, setActiveSettlement] = useState(null);
  const [activeShop, setActiveShop] = useState(null);
  const [activeNPC, setActiveNPC] = useState(null);
  const [model, setModel] = useState(null);
  const [shopsForRender, setShopsForRender] = useState([]);

  const axios = useAxios();
  const navigate = useNavigate();

  const freshPaper = () => {
    Model.instance = null;
    setScreen(SCREEN_DEFAULT);
    setMapLoading(true);
    setActiveSettlement(null);
    setActiveShop(null);
    setActiveNPC(null);
    setModel(null);
  };

  const generateShopIndexes = (mapData) => {
    freshPaper();

    //sorts shops based on size
    const sortShops = (shops) => {
      console.log(shops);
      const sorted = [];
      Object.keys(shops)
        .sort((a, b) => {
          return a - b;
        })
        .reverse()
        .forEach((k, v) => {
          sorted.push(shops[k]);
        });
      console.log(sorted);
      return sorted;
    };

    const pickShopIndexes = (shops, mapData) => {
      const sortedShops = sortShops(shops);
      const chosenIndexes = [];
      Random.reset(mapData.seed);
      const numberOfShops = Random.int(
        sortedShops.length / 5,
        sortedShops.length / 3
      );

      while (chosenIndexes.length < numberOfShops) {
        for (let i = 0; i < numberOfShops; i++) {
          if (chosenIndexes.length >= numberOfShops) break;
          if (
            chosenIndexes.indexOf(sortedShops[i]) == -1 &&
            Random.int(0, 10) > 4
          )
            chosenIndexes.push(sortedShops[i]);
        }
      }

      console.log(numberOfShops, chosenIndexes);
      return chosenIndexes;
    };

    const { seed, size } = mapData;
    new Model({
      size,
      seed,
      screen,
    });

    const allShops = {};
    Model.instance.patches.forEach((patch, index) => {
      const label = patch.ward.getLabel();

      if (Ward.shopWards.indexOf(label) != -1) {
        allShops[Number(patch.shape.perimeter)] = index;
      }
    });

    return pickShopIndexes(allShops, mapData);
  };

  const createAndDrawNewSettlement = async (options) => {
    freshPaper();
    const finalMapData = { ...MAP_DATA_DEFAULT, ...options.mapData };
    finalMapData.shopIndexes = generateShopIndexes(finalMapData);

    await axios
      .post("/settlement/", {
        mapData: finalMapData,
        name: options.name,
      })
      .then((res) => {
        const temp = res.data;
        temp.map_data = JSON.parse(temp.map_data);
        setActiveSettlement(temp);
        prepareMapAndNavigate(temp);
      })
      .catch((err) => console.log(err));
    //TODO: for some reason you need to wait some amount of time or it will not re-render
  };

  const drawExistingSettlement = async (settlementId) => {
    freshPaper();

    await axios
      .get("/settlement/" + settlementId + "/mega/")
      .then((res) => {
        const temp = res.data;
        temp.map_data = JSON.parse(temp.map_data);
        setActiveSettlement(temp);
        prepareMapAndNavigate(temp);
      })
      .catch((err) => console.log(err));
  };

  const getCaches = (settlement) => {
    const cache = {};

    cache.location = [...settlement.locations];

    cache.icon = Object.assign({}, settlement.icons);

    cache.npc = [];
    settlement.locations.forEach((loc) => {
      cache.npc.push(Object.assign({}, loc.npcs));
    });

    return cache;
  };

  const prepareMapAndNavigate = async (settlement) => {
    Model.instance = null;
    setShopsForRender([...settlement.locations]);
    setModel(
      new Model({
        size: settlement.map_data.size,
        seed: settlement.map_data.seed,
        caches: getCaches(settlement),
        screen: screen,
      })
    );
    setMapLoading(false);
    navigate("/settlement");
  };

  const updateActiveShopCash = async (moneyObj) => {
    const cloneShop = { ...activeShop, ...moneyObj };

    axios
      .put("/location/", cloneShop)
      .then((res) => {
        const trueShop = res.data;
        console.assert(
          cloneShop.gold === trueShop.gold &&
            cloneShop.silver === trueShop.silver &&
            cloneShop.copper === trueShop.copper
        );
      })
      .catch((err) => console.log(err));
  };

  const contextData = {
    screen,
    setScreen,
    mapLoading,
    activeSettlement,
    activeShop,
    activeNPC,
    setActiveShop,
    setActiveNPC,
    createAndDrawNewSettlement,
    drawExistingSettlement,
    updateActiveShopCash,
    model,
    setModel,
    shopsForRender,
  };

  return (
    <PaperContext.Provider value={contextData}>
      {children}
    </PaperContext.Provider>
  );
};
