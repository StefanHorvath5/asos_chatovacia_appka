import axios from "axios";
import { CREATE_CHANNEL_URL } from "../urls";
import { CHANNEL_CHOSEN } from "./types";

import { createAlert } from "./alerts";
import { tokenConfig, dispatchError } from "./helperFunctions";
import { getAllGroups } from "./groups";

export const createChannel = (groupId, name) => async (dispatch, getState) => {
  const body = JSON.stringify({ groupId, name });
  try {
    await axios.post(CREATE_CHANNEL_URL, body, tokenConfig(getState));
    dispatch(getAllGroups());
    dispatch(
      createAlert({
        variant: "success",
        message: "Channel created",
      })
    );
  } catch (error) {
    dispatch(dispatchError(error));
  }
};

export const setCurrentChannel = (socket, channelId) => (dispatch) => {
  socket.emit("joinChannel", channelId, () => {
    dispatch({
      type: CHANNEL_CHOSEN,
      payload: channelId,
    });
  });
};

export const getOldChannel = (socket) => (dispatch, getState) => {
  let x = getState().groups;
  if (getState().groups.chosenChannel) return;
  if (x && x.chosenGroup) {
    if (localStorage.getItem("chosenChannel")) {
      const cC = x.chosenGroup.group.channels.find((a) => {
        return a._id === localStorage.getItem("chosenChannel");
      });
      if (cC) {
        dispatch(setCurrentChannel(socket, cC._id));
      }
    }
  }
};
