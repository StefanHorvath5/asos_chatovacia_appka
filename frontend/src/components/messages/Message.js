import React, { useRef, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";

import { addEmojiReactionToMessage } from "../../actions/messages";

import EmojiPicker from "../common/EmojiPicker";
import { RenderFullMsg } from "./RenderFullMsg";

import emoji from "../../images/emoji.svg";

import "./Message.css";

const Message = ({
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
      pageY: currentPageY,
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
            right:  0,
            pointerEvents: "all",
          }}
        >
          <EmojiPicker
            close={() => {
              setPickEmojiReactionState({});
              setDisableActionsOnMessages(false);
            }}
            pickedEmoji={(chosenEmoji) => {
              addEmojiReactionToMessage(
                socket,
                msg,
                chosenEmoji ,
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
        className={ pickEmojiReactionState.state 
              ? "messageContentContainer messageClicked"
              : "messageContentContainer"
        }
        style={{
          paddingLeft: 30,
        }}
        title={moment(msg.date).format("YYYY/MM/DD HH:mm:ss")}
      >
        <div
          className="messageContent"
          style={{ maxWidth: "80%" }}

        >
          <div>
            
            <div
              style={{
                paddingLeft: 0,
              }}
            >

              <RenderFullMsg
                msg={msg}
                socket={socket}
              />
            </div>
          </div>
        </div>
        <small className="messageContentDate">
          {moment(msg.date).format("HH:mm:ss")}
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
