import axios from "axios";
import {
  CREATE_GROUP_URL,
  GET_ALL_GROUPS_URL,
  ADD_TO_GROUP_URL,
  GET_GROUP_BY_ID_URL,
} from "../urls";
import {
  AUTH_ERROR,
  GROUPS_LOADED,
  GROUPS_LOADING,
  GROUPS_ERROR,
  ADD_TO_GROUP_ERROR,
  GROUP_CREATED,
  GROUP_CHOSEN,
} from "./types";
import { createAlert } from "./alerts";
import {
  tokenConfig,
  dispatchError
} from "./helperFunctions";

export const getAllGroups = () => async (dispatch, getState) => {
  dispatch({ type: GROUPS_LOADING });
  if (localStorage.getItem("token")) {
    try {
      const res = await axios.get(GET_ALL_GROUPS_URL, tokenConfig(getState));
      dispatch({
        type: GROUPS_LOADED,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: GROUPS_ERROR,
      });
      dispatch(dispatchError(error));
    }
  } else {
    dispatch({
      type: AUTH_ERROR,
    });
    dispatch({
      type: GROUPS_ERROR,
    });
  }
};

export const createGroup = (name) => async (dispatch, getState) => {
  dispatch({ type: GROUPS_LOADING });
  const body = JSON.stringify({ name });

  try {
    const res = await axios.post(CREATE_GROUP_URL, body, tokenConfig(getState));
    dispatch({
      type: GROUP_CREATED,
      payload: res.data,
    });
    dispatch(
      createAlert({
        variant: "success",
        message: "Group created",
      })
    );
  } catch (error) {
    dispatch({
      type: GROUPS_ERROR,
    });
    dispatch(dispatchError(error));
  }
};


export const addToGroup = (groupId, color) => async (dispatch, getState) => {
  dispatch({ type: GROUPS_LOADING });
  const body = JSON.stringify({ groupId, color });

  try {
    const res = await axios.post(ADD_TO_GROUP_URL, body, tokenConfig(getState));
    dispatch({
      type: GROUP_CREATED,
      payload: res.data,
    });
    dispatch(
      createAlert({
        variant: "success",
        message: "Added to Group",
      })
    );
  } catch (error) {
    dispatch({
      type: ADD_TO_GROUP_ERROR,
    });
    dispatch(dispatchError(error));
  }
};

export const getGroupById = (groupId) => async (dispatch, getState) => {
  try {
    const data = await axios.get(
      GET_GROUP_BY_ID_URL(groupId),
      tokenConfig(getState)
    );
    return data.data.group;
  } catch (error) {
    dispatch({
      type: GROUPS_ERROR,
    });
    dispatch(dispatchError(error));
  }
  return;
};


export const setCurrentGroup = (socket, group) => (dispatch, getState) => {
  socket.emit("joinGroup", group.group._id, () => {
    dispatch({
      type: GROUP_CHOSEN,
      payload: group,
    });
  });
};


export const getOldGroup = (socket) => (dispatch, getState) => {
  let x = getState().groups.groups;
  let x1 = getState().groups.chosenGroup;
  if (
    x1 &&
    Object.keys(x1).length !== 0 &&
    x.find((f) => f.group._id === x1.group._id).group.channels ===
      x1.group.channels
  )
    return;
  if (x) {
    if (x1 && Object.keys(x1).length !== 0) {
      const cG = x.find((a) => {
        return a.group._id === x1.group._id;
      });
      if (cG) {
        dispatch(setCurrentGroup(socket, cG));
      }
    } else if (localStorage.getItem("chosenGroup")) {
      const cG = x.find((a) => {
        return a.group._id === localStorage.getItem("chosenGroup");
      });
      if (cG) {
        dispatch(setCurrentGroup(socket, cG));
      }
    } else {
      return;
    }
  } else {
    return;
  }
};
