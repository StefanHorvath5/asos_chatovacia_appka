import {
  MESSAGES_LOADING,
  MESSAGES_ERROR,
  NEW_MESSAGE,
  ALL_MESSAGES,
  SENDING_FILE,
  END_SENDING_FILE,
  NEW_REACTION_MESSAGE,
  ALREADY_REACTED_MESSAGE,
  WAITING_REACTION_MESSAGE,
} from "./types";
import { CLOUDINARY_SIGN_URL } from "../urls";

import {
  tokenConfig,
  dispatchError,
  getCloudinaryUrlAndFormData,
} from "./helperFunctions";

let numberOfMessages = 20;

export const setNumberOfMessages = (value) => {
  numberOfMessages = value;
};

export const getMessages =
  (socket, channelId, type) => (dispatch) => {
    dispatch({ type: MESSAGES_LOADING });
    if (type === "loadOlder") {
      numberOfMessages += 20;
    }
    console.log("1", numberOfMessages)
    socket.emit(
      "getMessages",
      channelId,
      numberOfMessages
    );
  };


const sendFileMessages = async (
  fileMessages,
  signData,
  dispatch
) => {
  let responses = [];
  for (let i = 0; i < fileMessages.length; i++) {
    dispatch({
      type:  SENDING_FILE,
      payload: `sending...(${i + 1}/${fileMessages.length})`,
    });

    const { url, data } = getCloudinaryUrlAndFormData(
      "auto",
      signData,
      fileMessages[i]
    );
    console.log(url, data)
    try {
      let data1 = await fetch(url, {
        method: "POST",
        body: data,
      });
      let newData1 = await data1.json();
      console.log(newData1)
      newData1.actual_filename = fileMessages[i].name;
      responses = [...responses, newData1];
    } catch (error) {
      dispatch(dispatchError(error));
    }
  }
  dispatch({
    type: END_SENDING_FILE,
  });
  return responses;
};

export const sendMessage =
  (socket, channelId, text, fileMessages) =>
    async (dispatch, getState) => {
      dispatch({
        type: MESSAGES_LOADING,
      });
      if (fileMessages.length) {
        const signResponse = await fetch(
          CLOUDINARY_SIGN_URL,
          tokenConfig(getState)
        );
        const signData = await signResponse.json();
        console.log(signData)
        let responses = await sendFileMessages(
          fileMessages,
          signData,
          dispatch
        );

        socket.emit(
          "clientMessage",
          channelId,
          text,
          responses
        );
      } else {
        socket.emit(
          "clientMessage",
          channelId,
          text,
          fileMessages
        );
      }
    };

export const addMessage = (message) => (dispatch) => {
  if (message) {
    dispatch({
      type: NEW_MESSAGE,
      payload: message.returnMsg,
    });
  } else {
    dispatch({
      type: MESSAGES_ERROR,
    });
  }
};

export const setAllMessages = (messages) => (dispatch) => {
  dispatch({
    type: ALL_MESSAGES,
    payload: messages,
  });
  numberOfMessages =
    messages.messages.length > 20 ? messages.messages.length : 20;

};


export const addEmojiReactionToMessage =
  (socket, msg, emojiName, toggleEmoji) =>
    async (dispatch, getState) => {
      dispatch({
        type: MESSAGES_LOADING,
      });
      socket.emit(
        "clientEmojiReaction",
        getState().groups.chosenChannel,
        msg._id,
        emojiName,
        toggleEmoji
      );
      if (toggleEmoji) {
        let state = false;
        let reactions = msg.emojiReactions.filter((x) => {
          if (x.name === emojiName && x.author === getState().auth.user._id) {
            state = true;
            return false;
          }
          return true;
        });
        if (!state) {
          reactions = [
            ...reactions,
            {
              author: getState().auth.user._id,
              name: emojiName,
            },
          ];
        }
        let newMsg = { ...msg, emojiReactions: reactions };
        dispatch({
          type: WAITING_REACTION_MESSAGE,
          payload: newMsg,
        });
      }
    };


export const addMessageReaction = (message) => (dispatch) => {
  if (message) {
    dispatch({
      type: NEW_REACTION_MESSAGE,
      payload: message.returnMsg,
    });
  } else {
    dispatch({
      type: MESSAGES_ERROR,
    });
  }
};


export const alreadyReacted = () => (dispatch) => {
  dispatch({
    type:
      ALREADY_REACTED_MESSAGE,
  });
};
