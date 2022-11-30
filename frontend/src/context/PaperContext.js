import { createContext, useState, useEffect } from "react";
import Model from "map/building/Model";
import MapDrawer from "map/mapping/MapDrawer";
import useAxios from "hooks/UseAxios";
import { useNavigate } from "react-router-dom";
import Shop from "map/data/Shop";

const PaperContext = createContext();

export default PaperContext;

export const PaperProvider = ({ children }) => {
    const MAP_DATA_DEFAULT = { seed: 1, size: 40, shopIndexes: [] };
    const SCREEN_DEFAULT = { w: 1400, h: 1200 };

    const [screen, setScreen] = useState(SCREEN_DEFAULT);
    const [mapLoading, setMapLoading] = useState(true);
    const [activeSettlement, setActiveSettlement] = useState(null);
    const [activeShop, setActiveShop] = useState(null);
    const [activeNPC, setActiveNPC] = useState(null);
    const [allShops, setAllShops] = useState([]);

    const axios = useAxios();
    const navigate = useNavigate();

    const freshPaper = () => {
        Model.instance = null;
        setScreen(SCREEN_DEFAULT)
        setMapLoading(true);
        setActiveSettlement(null);
        setActiveShop(null);
        setActiveNPC(null);
        setAllShops([]);
    }

    const generateShopIndexes = (mapData) => {
        freshPaper();
        const { seed, size } = mapData;
        new Model({
            size,
            seed,
            screen
        });
        return MapDrawer.generateShopIndexes();
    }

    const createAndDrawNewSettlement = async (options) => {
        freshPaper();

        const finalMapData = { ...MAP_DATA_DEFAULT, ...options.mapData };
        finalMapData.shopIndexes = [1, 2, 3, 4, 5, 6, 7]; //! Resolve generateShopIndexes(finalMapData.seed);

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
    }

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
    }

    const getCaches = (settlement) => {
        const cache = {};

        cache.location = [...settlement.locations];

        cache.icon = Object.assign({}, settlement.icons);

        cache.npc = [];
        settlement.locations.forEach((loc) => {
            cache.npc.push(Object.assign({}, loc.npcs));
        });

        return cache;
    }

    const prepareMapAndNavigate = async (settlement) => {
        console.log(settlement)
        Model.instance = null;
        console.log(
            "Seed at map gen",
            settlement.map_data.seed
        );
        new Model(
            {
                size: settlement.map_data.size,
                seed: settlement.map_data.seed,
                caches: getCaches(settlement),
                screen: screen
            }
        );
        new MapDrawer(screen);
        setAllShops(Shop.allShops);
        setMapLoading(false);
        navigate('/settlement');
    }

    const updateActiveShopCash = async (moneyObj) => {
        const cloneShop = { ...activeShop, ...moneyObj };

        axios.put(
            '/location/',
            cloneShop
        ).then((res) => {
            const trueShop = res.data;
            console.assert(
                (cloneShop.gold === trueShop.gold) &&
                (cloneShop.silver === trueShop.silver) &&
                (cloneShop.copper === trueShop.copper));

        }).catch((err) => console.log(err));

    }

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
        updateActiveShopCash
    };

    return (
        <PaperContext.Provider value={contextData}>
            {children}
        </PaperContext.Provider>
    );
};
