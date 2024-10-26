import React from "react";
import { connect } from "react-redux";

const URL_REGEX1 =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const URL_REGEX2 =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/;

const MessageText = ({ content }) => {
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
  for (var i = 0; i < texts.length; i++) {
    const currentText = texts[i];
    if (i % 2 && i + 1 < texts.length) {

      currentContent = currentContent + `:${currentText}:`;
    } else if (i % 2) {
      currentContent = currentContent + `:${currentText}`;
    } else {
      if (currentText === "") continue;
      currentContent = currentContent + `${currentText}`;
    }

  }
  if (currentContent) newContent.push(renderText(currentContent));
  return <>{newContent}</>;
};

export default connect(null, null)(MessageText);
