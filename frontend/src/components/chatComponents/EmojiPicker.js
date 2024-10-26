import React, { useRef } from "react";
import { connect } from "react-redux";

import { useClickAwayClose } from "../CustomComponents";

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

const EmojiPicker = ({ close, pickedEmoji }) => {
  const wrapperRef = useRef(null);
  useClickAwayClose(wrapperRef, close);
  return (
    <div className="emojiPickerContainer" ref={wrapperRef}>
      {defaultEmojis.map((em) => (
        <div
          className="oneEmojiContainer"
          title={em}
          onClick={(e) => {
            pickedEmoji(em);
            close();
          }}
        >
          <p style={{ fontSize: 24 }}>{em}</p>
        </div>
      ))}
    </div>
  );
};


export default connect(null, {})(EmojiPicker);
