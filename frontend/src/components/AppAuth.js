import React, { useState, useContext, useMemo } from "react";
import AppContext from "./Context/AppContext";
import { AUTH_TOKEN_STORAGE } from "../Constants";


const AppAuth = React.memo(({ children }) => {

    let [auth, setAuth] = useState(() => localStorage.getItem(AUTH_TOKEN_STORAGE) ? JSON.parse(localStorage.getItem(AUTH_TOKEN_STORAGE)) : null);
    let [user, setUser] = useState(() => auth ? {} : {});


    const updateUser = (u) => {
        console.log('HELLO')
        setUser(u ? u : null);
    }

    let contextData = useMemo(() => ({
        user,
        updateUser
    })[user, updateUser])

    return (
        <AppContext.Provider value={contextData}>
            {children}
        </AppContext.Provider>
    )
});

export default AppAuth;