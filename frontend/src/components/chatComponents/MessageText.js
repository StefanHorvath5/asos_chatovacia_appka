import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "../../css/MessageText.css";

const URL_REGEX1 =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const URL_REGEX2 =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/;

const MessageText = ({ channelType, content, emojis }) => {
  var texts = content.split(":");
  var newContent = [];
  let currentContent = "";

  const renderText = (text) => {
    return text.split(" ").map((part, i) => (
      <p className="textContent" style={{ display: "inline" }} key={`text${i}`}>
        {URL_REGEX1.test(part) ? (
          <a
            href={part}
            target="blank"
            className="textLink"
            onClick={(e) => e.stopPropagation()}
          >
            {part}{" "}
          </a>
        ) : URL_REGEX2.test(part) ? (
          <a
            href={`https://${part}`}
            target="blank"
            className="textLink"
            onClick={(e) => e.stopPropagation()}
          >
            {"https://"}
            {part}{" "}
          </a>
        ) : (
          part + " "
        )}
      </p>
    ));
  };
  if (channelType === 1) {
    currentContent = content;
  } else {
    for (var i = 0; i < texts.length; i++) {
      const currentText = texts[i];
      if (i % 2 && i + 1 < texts.length) {
        let currentEmoji = emojis.find((x) => x.name === currentText);
        if (currentEmoji) {
          newContent.push(renderText(currentContent));
          currentContent = "";
          newContent.push(
            <img
              className="textContent"
              key={`img${i}`}
              src={currentEmoji.file}
              style={{
                paddingRight: 2,
                paddingLeft: i === 1 && texts[0] === "" ? 0 : 2,
              }}
              title={`:${currentEmoji.name}:`}
              alt={currentEmoji.name || "daco plano"}
              width="35"
            />
          );
        } else {
          currentContent = currentContent + `:${currentText}:`;
        }
      } else if (i % 2) {
        currentContent = currentContent + `:${currentText}`;
      } else {
        if (currentText === "") continue;
        currentContent = currentContent + `${currentText}`;
      }
    }
  }
  if (currentContent) newContent.push(renderText(currentContent));
  return <>{newContent}</>;
};

MessageText.propTypes = {
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

export default connect(mapStateToProps, null)(MessageText);
