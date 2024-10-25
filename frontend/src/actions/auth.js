import axios from "axios";
import { LOGIN_URL, REGISTER_URL, GET_USER_URL } from "../urls";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  GROUPS_LOGOUT,
  GROUPS_LOADED,
} from "./types";

import { createAlert } from "./alerts";
import { config, tokenConfig, dispatchError } from "./helperFunctions";

export const loadUser = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  if (localStorage.getItem("token")) {
    try {
      const res = await axios.get(GET_USER_URL, tokenConfig(getState));
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
      dispatch({
        type: GROUPS_LOADED,
        payload: res.data.user,
      });
    } catch (error) {
      dispatch({
        type: AUTH_ERROR,
      });
      dispatch(dispatchError(error));
    }
  } else {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const logout = (socket) => (dispatch) => {
  dispatch({ type: USER_LOADING });
  localStorage.removeItem("token");
  localStorage.removeItem("expiresIn");
  socket.close();
  dispatch({
    type: LOGOUT_SUCCESS,
  });
  dispatch({
    type: GROUPS_LOGOUT,
  });
  dispatch(
    createAlert({
      variant: "warning",
      message: "You've been logged out!",
    })
  );
};

export const login = (username, password) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post(LOGIN_URL, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch({
      type: GROUPS_LOADED,
      payload: res.data.user,
    });
    dispatch(
      createAlert({
        variant: "success",
        message: "Logged in:)",
      })
    );
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch(dispatchError(error));
  }
};

export const register = (username, password) => async (dispatch) => {
  dispatch({ type: USER_LOADING });
  const body = JSON.stringify({ username, password });

  try {
    const res = await axios.post(REGISTER_URL, body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch({
      type: GROUPS_LOADED,
      payload: res.data.user,
    });
    dispatch(
      createAlert({
        variant: "success",
        message: "Your account has been created",
      })
    );
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
    dispatch(dispatchError(error));
  }
};
