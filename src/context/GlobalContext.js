import React, { createContext, useReducer } from "react";

import { AppReducer } from "./AppReducer";
import { LOGOUT, SET_LANGUAGE, SET_USER } from "./types";
// import ToastNotify from 'components/common/ToastNotify';

// init state
const initState = {
  isAuthenticated: false,
  user: {},
  language: "en",
};

// create context
export const GlobalContext = createContext(initState);

// provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initState);

  function setCurrentUser(user) {
    dispatch({
      type: SET_USER,
      payload: user,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    dispatch({
      type: LOGOUT,
    });
  }

  function setLanguage(language) {
    localStorage.setItem("lang", language);
    dispatch({
      type: SET_LANGUAGE,
      payload: language,
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        language: state.language,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        setLanguage,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
