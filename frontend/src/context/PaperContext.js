import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Model from "map/building/Model";
import MapDrawer from "map/mapping/MapDrawer";

const PaperContext = createContext();

export default PaperContext;

export const PaperProvider = ({ children }) => {
    const [screen, setScreen] = useState({ w: 1400, h: 1200 });
    const [mapLoading, setMapLoading] = useState(true);
    const [options, setoptions] = useState({ seed: 1, size: "Metropolis" });
    const [activeSettlement, setActiveSettlement] = useState(null);
    const [activeShop, setActiveShop] = useState(null);

    const clear = useCallback(() => {
        Model.instance = null;
    }, []);

    const generateNewSettlement = useCallback((options) => {
        const { seed = String(Date.now()).substring(-5), size } = options;
        Model.instance = null;
        console.log(
            "Seed at map gen",
            seed
        );
        new Model(
            MapDrawer.SETTLEMENT_SIZE_MAP[
            Paper.i.props.activeSettlement.map_data.size
            ],
            Paper.i.props.activeSettlement.map_data.seed
        );
        new MapDrawer();
    }, []);

    const SetActiveShop = useCallback((shop) => {
        Paper.i.props.setActiveShop(shop);
    }, []);

    const wipe = useCallback(() => {
        //Paper.i.props.createNewSettlement();
    }, []);


    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwt_decode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <PaperContext.Provider value={contextData}>
            {loading ? null : children}
        </PaperContext.Provider>
    );
};
