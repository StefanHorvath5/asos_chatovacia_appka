import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";

import { addEmojiReactionToMessage } from "../../actions/messages";

import MessageText from "./MessageText";

import "../../css/RenderFullMsg.css";

export const RenderFullMsgNotConnected = ({
  socket,
  msg,
  addEmojiReactionToMessage,
  userId,
  messageLoading,
}) => {
  const saveFile = (url, newName) => {
    saveAs(url, newName);
  };
  const emojiReactions = (socket) => {
    let a = {};
    msg.emojiReactions.map((x) => {
      if (a[x.name]) {
        a[x.name].count += 1;
      } else {
        a[x.name] = {
          name: x.name,
          count: 1,
          author: false,
        };
      }
      if (x.author === userId) {
        a[x.name].author = true;
      }
      return "a";
    });
    let returnJsx = [];
    for (let key in a) {
      let str = { name: a[key].name };
      if (str) {
        returnJsx.push(
          <div
            key={str.name}
            className="emojiReactionDiv"
            onClick={(e) => {
              if (!messageLoading && socket) {
                addEmojiReactionToMessage(
                  socket,
                  msg,
                  str.name,
                  true
                );
              }
              e.stopPropagation();
            }}
            style={{
              border: a[key].author ? "1px solid #5050f0" : "1px solid #5e5c5c",
              backgroundColor: messageLoading && "#2f3136",
            }}
          >
            <p style={{ fontSize: 16 }}>{str.name}</p>
            <p className="emojiReactionCount">{a[key].count}</p>
          </div>
        );
      }
    }
    return returnJsx;
  };
  return (
    <>
      <div>
        {msg.text && <MessageText content={msg.text} />}
        {msg.files.length
          ? msg.files.map((m, i) => {
            if (m.resource_type === "image") {
              return (
                <a
                  style={{
                    paddingLeft: msg.text || i ? 5 : 0,
                  }}
                  key={i}
                  href={m.secure_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={m.secure_url} alt="obrazok" width="150" />
                </a>
              );
            } else {
              return (
                <p
                  style={{
                    paddingLeft: msg.text || i ? 5 : 0,
                  }}
                  key={i}
                  className="aMessage"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveFile(m.secure_url, m.actual_filename || m.public_id);
                  }}
                >
                  {m.actual_filename ? m.actual_filename : m.public_id}
                </p>
              );
            }
          })
          : null}
      </div>
      {msg.emojiReactions.length !== 0 && (
        <div className="emojiReactionsContainer">{emojiReactions(socket)}</div>
      )}
    </>
  );
};

RenderFullMsgNotConnected.propTypes = {
  addEmojiReactionToMessage: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  messageLoading: PropTypes.bool.isRequired,
};

const mapStateToProps1 = (state) => {
  if (state.groups.chosenGroup) {
    return {
      userId: state.auth.user._id,
      messageLoading: state.messages.isLoading,
    };
  } else {
    return {
      userId: state.auth.user._id,
      messageLoading: state.messages.isLoading,
    };
  }
};

export const RenderFullMsg = connect(mapStateToProps1, {
  addEmojiReactionToMessage,
})(RenderFullMsgNotConnected);
