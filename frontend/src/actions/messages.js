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

export const setNumberOfMessages = (type, value) => {
  numberOfMessages = value;
};

export const getMessages =
  (channelType, socket, channelId, type) => (dispatch) => {
    dispatch({ type: MESSAGES_LOADING });
    if (type === "loadOlder") {
      numberOfMessages += 20;
    }
    socket.emit(
      "getMessages",
      channelType,
      channelId,
      numberOfMessages
    );
  };


const sendFileMessages = async (
  channelType,
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
  (channelType, socket, channelId, text, fileMessages, replyOnMessage) =>
    async (dispatch, getState) => {
      dispatch({
        type: MESSAGES_LOADING,
      });
      const parentMsgId =
        Object.keys(replyOnMessage).length !== 0 ? replyOnMessage._id : null;

      if (fileMessages.length) {
        const signResponse = await fetch(
          CLOUDINARY_SIGN_URL,
          tokenConfig(getState)
        );
        const signData = await signResponse.json();
        console.log(signData)
        let responses = await sendFileMessages(
          channelType,
          fileMessages,
          signData,
          dispatch
        );

        socket.emit(
          "clientMessage",
          channelType,
          channelId,
          text,
          responses,
          parentMsgId
        );
      } else {
        socket.emit(
          "clientMessage",
          channelType,
          channelId,
          text,
          fileMessages,
          parentMsgId
        );
      }
    };

export const addMessage = (channelType, message) => (dispatch) => {
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

export const setAllMessages = (channelType, messages) => (dispatch) => {
  dispatch({
    type: ALL_MESSAGES,
    payload: messages,
  });
  numberOfMessages =
    messages.messages.length > 20 ? messages.messages.length : 20;

};


export const addEmojiReactionToMessage =
  (channelType, socket, msg, emojiType, emojiName, toggleEmoji) =>
    async (dispatch, getState) => {
      dispatch({
        type: MESSAGES_LOADING,
      });
      socket.emit(
        "clientEmojiReaction",
        channelType,
        getState().groups.chosenChannel,
        msg._id,
        emojiType,
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
              type: emojiType,
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


export const addMessageReaction = (channelType, message) => (dispatch) => {
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


export const alreadyReacted = (channelType) => (dispatch) => {
  dispatch({
    type:
      ALREADY_REACTED_MESSAGE,
  });
};
