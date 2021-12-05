import { LOGOUT, SET_LANGUAGE, SET_USER } from "./types";

export const AppReducer = (state, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };

    case SET_USER:
      return {
        ...state,
        isAuthenticated: !!Object.keys(action.payload).length,
        user: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };

    default:
      return state;
  }
};
