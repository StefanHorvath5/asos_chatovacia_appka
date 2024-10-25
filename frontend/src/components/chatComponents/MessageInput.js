import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { sendMessage } from "../../actions/messages";

import EmojiPicker from "./EmojiPicker";

import emojiSvg from "../../images/emoji.svg";
import inputFileSvg from "../../images/inputFile.svg";

import "../../css/MessageInput.css";

const MessageInput = ({
  channelType,
  socket,
  replyOnMessage,
  inputText,
  setDisableActionsOnMessages,
  chosenChannel,
  sendMessage,
}) => {
  const inputFile = useRef(null);
  const [message, setMessage] = useState("");
  const [fileMessages, setFileMessages] = useState([]);
  const [pickEmojiState, setPickEmojiState] = useState(false);

  const messageChange = (text) => {
    if (!message && text) {
      socket.emit(
        "typing",
        channelType,
        chosenChannel
      );
    } else if (message && !text) {
      socket.emit(
        "stoppedTyping",
        channelType,
        chosenChannel
      );
    }
    setMessage(text);
  };

  const onPasteImage = (event) => {
    var items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (let index in items) {
      var item = items[index];
      if (item.kind === "file") {
        var blob = item.getAsFile();
        setFileMessages([...fileMessages, blob]);
      }
    }
  };

  const listFileMessages = (f) => {
    let fmsgs = [];
    for (let i = 0; i < f.length; i++) {
      fmsgs.push(<p className="listInputMessageFile">{f[i].name}</p>);
    }
    return fmsgs;
  };

  return (
    <div>
      <div style={{ height: 20 }}></div>
      <div
        className="inputBoxContainer"
        style={{
          height: fileMessages.length
                ? 80
                : 60,
        }}
      >
        <div
          className="listInputMessageFiles"
          style={{
            display: fileMessages.length ? "flex" : "none",
          }}
        >
          {fileMessages.length ? (
            listFileMessages(fileMessages)
          ) : (
            <p style={{ height: 20 }}></p>
          )}
        </div>
        <div className="inputAndSendContainer">
          <div className="inputMessageContainer">
            <input
              className="inputMessageText"
              name="message"
              placeholder="Message..."
              value={message}
              onChange={(e) => {
                messageChange(e.target.value);
              }}
              onPaste={(e) => {
                onPasteImage(e);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && (message || fileMessages.length)) {
                  sendMessage(
                    channelType,
                    socket,
                    chosenChannel,
                    message,
                    fileMessages,
                    replyOnMessage
                  );
                  messageChange("");
                  setFileMessages([]);
                }
              }}
              ref={inputText}
              autoFocus
            />
            <input
              type="file"
              name="fileMessages"
              multiple
              onClick={(event) => {
                event.target.value = null;
              }}
              onChange={(e) => setFileMessages(e.target.files)}
              style={{ display: "none" }}
              ref={inputFile}
            />
            {pickEmojiState && (
              <div
                className="emojiBox"
                style={{ right: channelType === 0 ? 10 : -35 }}
              >
                <EmojiPicker
                  channelType={channelType}
                  close={() => {
                    setPickEmojiState(false);
                    setDisableActionsOnMessages(false);
                    inputText.current.focus();
                  }}
                  pickedEmoji={(emojiType, chosenEmoji) => {
                    if (emojiType === 0) {
                      messageChange(message + chosenEmoji + " ");
                    } else {
                      messageChange(message + ":" + chosenEmoji.name + ":");
                    }

                    inputText.current.focus();
                  }}
                />
              </div>
            )}
            <button
              className="inputEmoji"
              onClick={() => {
                setDisableActionsOnMessages(!pickEmojiState);
                setPickEmojiState(!pickEmojiState);
              }}
            >
              <img src={emojiSvg} alt="Emoji" width="24" height="24" />
            </button>
            <button
              className="inputMessageFile"
              onClick={() => inputFile.current.click()}
            >
              <img src={inputFileSvg} alt="Files" width="24" height="24" />
            </button>
          </div>

          <div className="sendMessageContainer">
            <button
              className="sendMessageButton"
              disabled={!(message || fileMessages)}
              onClick={() => {
                sendMessage(
                  channelType,
                  socket,
                  chosenChannel ,
                  message,
                  fileMessages,
                  replyOnMessage
                );
                messageChange("");
                setFileMessages([]);
                inputText.current.focus();
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

MessageInput.propTypes = {
  chosenChannel: PropTypes.string,
  sendMessage: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  chosenChannel: state.groups.chosenChannel,
});

export default connect(mapStateToProps, {
  sendMessage,
})(MessageInput);