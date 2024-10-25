import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";

import { addEmojiReactionToMessage } from "../../actions/messages";

import EmojiPicker from "./EmojiPicker";
import { RenderFullMsg } from "./RenderFullMsg";

import emoji from "../../images/emoji.svg";
import dots from "../../images/dots.svg";

import "../../css/Message.css";

const Message = ({
  channelType,
  socket,
  showAuthorName,
  msg,
  setDisableActionsOnMessages,
  addEmojiReactionToMessage,
}) => {
  const messageContainer = useRef(null);
  const [pickEmojiReactionState, setPickEmojiReactionState] = useState({});

  const handleMessageEmojiReactionClick = (e) => {
    const elem = messageContainer.current.getBoundingClientRect();
    const currentPageY =
      e.pageY < 160 ? e.pageY - elem.y : e.pageY - elem.y - 135;
    setPickEmojiReactionState({
      state: true,
      pageY: channelType === 1 ? 10 : currentPageY,
    });
    setDisableActionsOnMessages(true);
  };
  return (
    <li className="wholeMessage">
      {pickEmojiReactionState.state && (
        <div
          className="messageEmojiReactionsBox"
          style={{
            top: pickEmojiReactionState.pageY,
            right: channelType === 0 ? 145 : 0,
            pointerEvents: "all",
          }}
        >
          <EmojiPicker
            channelType={channelType}
            close={() => {
              setPickEmojiReactionState({});
              setDisableActionsOnMessages(false);
            }}
            pickedEmoji={(emojiType, chosenEmoji) => {
              addEmojiReactionToMessage(
                channelType,
                socket,
                msg,
                emojiType,
                emojiType === 0 ? chosenEmoji : chosenEmoji.name,
                false
              );
              setPickEmojiReactionState({});
              setDisableActionsOnMessages(false);
            }}
          />
        </div>
      )}

      {showAuthorName && (
        <>
          <div className="messageTitleContainer">
            <h4
              className="authorName"
              style={{
                color: "#9957db",
              }}
            >
              {msg.author.username}
              {" : "}
            </h4>
          </div>
        </>
      )}
      <div
        ref={messageContainer}
        className={
          msg.parent && Object.keys(msg.parent) !== 0
            ? pickEmojiReactionState.state 
              ? "messageContentWithReplyContainer messageClicked"
              : "messageContentWithReplyContainer"
            : pickEmojiReactionState.state 
              ? "messageContentContainer messageClicked"
              : "messageContentContainer"
        }
        style={{
          paddingLeft:
            channelType === 1
              ? 5
              : msg.parent && Object.keys(msg.parent) !== 0
                ? 0
                : 30,
        }}
        title={moment(msg.date).format("YYYY/MM/DD HH:mm:ss")}
      >
        <div
          className="messageContent"
          style={{ maxWidth: channelType === 1 ? "70%" : "80%" }}

        >
          {msg.parent && Object.keys(msg.parent) !== 0 && (
            <div className="parentMessageContainer">
              <h4
                className="authorName"
                style={{
                  color: "#9957db",
                  flexShrink: 0,
                }}
              >
                {msg.parent.author.username}
                {" : "}
              </h4>
              <div
                style={{
                  paddingLeft: 20,
                  flex: "1 1 auto",
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                <RenderFullMsg
                  channelType={channelType}
                  msg={msg.parent}
                  socket={socket}
                />
              </div>
            </div>
          )}
          <div>
            {msg.parent && Object.keys(msg.parent) !== 0 && (
              <>
                <h4
                  className="authorName"
                  style={{
                    color: "#9957db",
                  }}
                >
                  {msg.author.username}
                </h4>
                's reply:{" "}
              </>
            )}
            <div
              style={{
                paddingLeft:
                  msg.parent && Object.keys(msg.parent) !== 0 ? 30 : 0,
              }}
            >

              <RenderFullMsg
                channelType={channelType}
                msg={msg}
                socket={socket}
              />
            </div>
          </div>
        </div>
        <small className="messageContentDate">
          {channelType === 0
            ? moment(msg.date).format("HH:mm:ss")
            : moment(msg.date).format("HH:mm")}
        </small>
        <div
          className={pickEmojiReactionState.state
              ? "messageButtonsContainer messageButtonsContainerClicked"
              : "messageButtonsContainer"
          }
        >
          <button
            className="messageButton"
            onClick={(e) => {
              handleMessageEmojiReactionClick(e);
              e.stopPropagation();
            }}
          >
            <img src={emoji} alt="Emoji" width="24" />
          </button>
          <button
            className="messageButton"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img src={dots} alt="..." width="24" />
          </button>
        </div>
      </div>
    </li>
  );
};

Message.propTypes = {
  addEmojiReactionToMessage: PropTypes.func.isRequired,
};
export default connect(null, { addEmojiReactionToMessage })(
  Message
);
