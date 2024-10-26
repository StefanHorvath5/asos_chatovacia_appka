import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ScrollToBottom, {
  useScrollToBottom,
  useScrollToTop,
} from "react-scroll-to-bottom";

import { getMessages, setNumberOfMessages } from "../../actions/messages";

import Message from "./Message";
import MessageInput from "./MessageInput";

import "../../css/Chatting.css";

const ScrollToBottomButtons = ({ scrollToBottomRef, scrollToTopRef }) => {
  const scrollToBottom = useScrollToBottom();
  const scrollToTop = useScrollToTop();
  return (
    <div style={{ display: "none" }}>
      <button ref={scrollToBottomRef} onClick={scrollToBottom}>
        Click me to scroll to bottom
      </button>
      <button ref={scrollToTopRef} onClick={scrollToTop}>
        Click me to scroll to top
      </button>
    </div>
  );
};

const Chatting = ({
  socket,
  inputText,
  scrollToTopRef,
  scrollToBottomRef,
  chosenChannel,
  fileMessageLoading,
  messages,
  getMessages,
}) => {
  const [disableActionsOnMessages, setDisableActionsOnMessages] =
    useState(false);
  let lastShowedUsernameIndex = 0;

  const checkShowAuthorUsername = (msg, i) => {
    if (
      (i === 0 ||
        messages[i - 1].author.username !== msg.author.username ||
        (i - lastShowedUsernameIndex > 5 &&
          messages
            .slice(lastShowedUsernameIndex, i)
            .every((v) => v.author.username === msg.author.username))) &&
      (!msg.parent || Object.keys(msg.parent) === 0)
    ) {
      lastShowedUsernameIndex = i;
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (chosenChannel) {
      scrollToBottomRef.current.click();
    }
    setNumberOfMessages(20);
  }, [chosenChannel, scrollToBottomRef]);

  useEffect(() => {
    getMessages(socket, chosenChannel, "none");
  }, [socket, chosenChannel, getMessages]);

  return (
    <div className="chattingContainer">
      <div
        className="loadOlderDiv"
        onClick={() => {
          getMessages(socket, chosenChannel, "loadOlder");
        }}
      >
        Load older
      </div>
      <ScrollToBottom
        className="chattingMessagesDivScroll"
        followButtonClassName="followButton"
      >
        <ScrollToBottomButtons
          scrollToBottomRef={scrollToBottomRef}
          scrollToTopRef={scrollToTopRef}
        />

        <ul
          className="chattingUl"
          style={{ pointerEvents: disableActionsOnMessages ? "none" : "auto" }}
        >
          {messages.map((msg, i) => {
            return (
              <div key={i}>
                <Message
                  key={i}
                  socket={socket}
                  msg={msg}
                  setDisableActionsOnMessages={setDisableActionsOnMessages}
                  inputText={inputText}
                  showAuthorName={checkShowAuthorUsername(msg, i)}
                />
              </div>
            );
          })}
        </ul>
      </ScrollToBottom>
      <div>{fileMessageLoading && fileMessageLoading}</div>
      <div className="chattingMessageInput">
        <MessageInput
          socket={socket}
          inputText={inputText}
          setDisableActionsOnMessages={setDisableActionsOnMessages}
        />
      </div>
    </div>
  );
};

Chatting.propTypes = {
  chosenChannel: PropTypes.string,
  fileMessageLoading: PropTypes.string,
  messages: PropTypes.array.isRequired,
  getMessages: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  chosenChannel: state.groups.chosenChannel,
  messages: state.messages.messages,
  fileMessageLoading: state.messages.fileMessageLoading,
});

export default connect(mapStateToProps, {
  getMessages,
})(Chatting);
