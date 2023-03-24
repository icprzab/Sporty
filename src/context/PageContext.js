// import { createContext, useReducer } from "react";
// import AuthReducer from "./AuthReducer"
import React from "react";
// const INITIAL_STATE = {
//     currentUser: null,
// }


import { createContext } from "react"
export const PageContext = createContext(null)



// export const AuthContext = createContext(INITIAL_STATE);

// export const AuthContextProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

//     return (
//         <AuthContext.Provider value={{ currentUser: state.current, dispatch }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }