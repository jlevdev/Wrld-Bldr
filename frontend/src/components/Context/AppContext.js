import React, { useContext } from "react";


const AppContext = React.createContext({ user: {} });

export const useUser = () => {
    const auth = useContext(AppContext);
    return auth.user;
};

export const useUpdateUser = () => {
    const auth = useContext(AppContext);
    return auth.updateUser;
};

export default AppContext;