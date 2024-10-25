import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  expiresIn: localStorage.getItem("expiresIn"),
  isAuthenticated: null,
  isLoading: true,
  user: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case USER_LOADED:
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("expiresIn", action.payload.expiresIn);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        expiresIn: action.payload.expiresIn,
        isAuthenticated: true,
        isLoading: false,
      };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("chosenGroup");
      localStorage.removeItem("chosenChannel");
      return {
        ...state,
        token: null,
        expiresIn: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("chosenGroup");
      localStorage.removeItem("chosenChannel");
      return {
        ...state,
        token: null,
        expiresIn: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}
