import React, { useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { useClickAwayClose } from "../CustomComponents";

import "../../css/EmojiPicker.css";

const defaultEmojis = [
  "🙃",
  "😀",
  "🤣",
  "😅",
  "😂",
  "👍",
  "🙉",
  "😍",
  "🤮",
  "💯",
  "🦥",
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
  "🅰️",
  "🅱️",
];

const EmojiPicker = ({ channelType, close, pickedEmoji, emojis }) => {
  const wrapperRef = useRef(null);
  useClickAwayClose(wrapperRef, close);
  return (
    <div className="emojiPickerContainer" ref={wrapperRef}>
      {channelType === 0 &&
        emojis.map((emoji) => (
          <div
            className="oneEmojiContainer"
            title={emoji.name}
            onClick={(e) => {
              if (emoji.file && emoji.name) {
                pickedEmoji(1, emoji);
                close();
              } else {
                close();
              }
            }}
          >
            <img src={emoji.file} alt="ne" width="24" />
          </div>
        ))}
      {defaultEmojis.map((em) => (
        <div
          className="oneEmojiContainer"
          title={em}
          onClick={(e) => {
            pickedEmoji(0, em);
            close();
          }}
        >
          <p style={{ fontSize: 24 }}>{em}</p>
        </div>
      ))}
    </div>
  );
};

EmojiPicker.propTypes = {
  emojis: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  if (state.groups.chosenGroup) {
    return {
      emojis: state.groups.chosenGroup.group.emojis,
    };
  } else {
    return {
      emojis: [],
    };
  }
};
export default connect(mapStateToProps, {})(EmojiPicker);
