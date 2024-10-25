import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Groups from "./Groups";
import Channels from "./Channels";
import Chatting from "./Chatting";
import Info from "./Info";
import { useClickAwayClose } from "../CustomComponents";

import {
  addMessage,
  setAllMessages,
  addMessageReaction,
  alreadyReacted,
} from "../../actions/messages";

import peopleSvg from "../../images/people.svg";
import hamburgerSvg from "../../images/hamburger.svg";

import "../../css/Chat.css";

const Chat = ({
  socket,
  setModalGroupState,
  setModalChannelState,
  setModalGroupSettingsState,
  matches960,
  chosenChannel,
  addMessage,
  addMessageReaction,
  alreadyReacted,
  setAllMessages,
}) => {
  const [showLeftState, setShowLeftState] = useState(false);
  const [showRightState, setShowRightState] = useState(false);
  const leftSidebarWrapperRef = useRef(null);
  const rightSidebarWrapperRef = useRef(null);
  const scrollToTopRef = useRef(null);
  const scrollToBottomRef = useRef(null);
  const inputText = useRef(null);

  useClickAwayClose(leftSidebarWrapperRef, () => {
    setShowLeftState(false);
    if (inputText.current) inputText.current.focus();
  });
  useClickAwayClose(rightSidebarWrapperRef, () => {
    setShowRightState(false);
    if (inputText.current) inputText.current.focus();
  });

  useEffect(() => {
    socket.on("serverMessage", (channelType, msg) => {
      addMessage(channelType, msg);
    });
    socket.on("serverEmojiReaction", (channelType, msg) => {
      addMessageReaction(channelType, msg);
    });
    socket.on("alreadyReacted", (channelType) => {
      alreadyReacted(channelType);
    });
    socket.on("allMessages", (channelType, messages) => {
      setAllMessages(channelType, messages);
    });
    return () => {
      socket.off("serverMessage");
      socket.off("serverEmojiReaction");
      socket.off("alreadyReacted");
      socket.off("allMessages");
    };
  }, [
    socket,
    addMessage,
    setAllMessages,
    addMessageReaction,
    alreadyReacted,
  ]);

  return (
    <>
      <div className="chatContainer">
        {matches960 ? (
          <>
            <nav className="groupNav">
              <Groups
                display={true}
                socket={socket}
                setModalGroupState={setModalGroupState}
              />
            </nav>
            <div className="channelsNav">
              <Channels
                display={true}
                socket={socket}
                setModalChannelState={setModalChannelState}
                setModalGroupSettingsState={setModalGroupSettingsState}
              />
            </div>
          </>
        ) : showLeftState ? (
          <div
            className="showAbsoluteSideBar leftSidebar"
            ref={leftSidebarWrapperRef}
          >
            <div className="chatContainer">
              <nav className="groupNav">
                <Groups
                  display={true}
                  socket={socket}
                  setModalGroupState={setModalGroupState}
                />
              </nav>
              <div className="channelsNav">
                <div
                  className="hideTopNavDiv hideTopNavDivLeft"
                  onClick={() => setShowLeftState(false)}
                >
                  {"< Hide"}
                </div>
                <Channels
                  display={true}
                  socket={socket}
                  setShowLeftState={setShowLeftState}
                  setModalChannelState={setModalChannelState}
                  setModalGroupSettingsState={setModalGroupSettingsState}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <Groups
              display={false}
              socket={socket}
              setModalGroupState={setModalGroupState}
            />
            <Channels
              display={false}
              socket={socket}
              setModalChannelState={setModalChannelState}
              setModalGroupSettingsState={setModalGroupSettingsState}
            />
          </>
        )}
        <section className="chattingSection">
          <div className="chattingTopNav">
            <div>
              {!matches960 && (
                <div
                  onClick={() => {
                    setShowRightState(false);
                    setShowLeftState(true);
                  }}
                >
                  <img
                    src={hamburgerSvg}
                    alt=">"
                    width="24"
                    height="24"
                    className="actionIcon"
                  />
                </div>
              )}
            </div>
            <div className="chattingTopNavRight">
              {!matches960 && (
                <div
                  onClick={() => {
                    setShowLeftState(false);
                    setShowRightState(true);
                  }}
                >
                  <img
                    src={peopleSvg}
                    alt="<"
                    width="24"
                    height="24"
                    className="actionIcon"
                  />
                </div>
              )}
            </div>
          </div>

          {chosenChannel && socket.connected && (
            <Chatting
              setShowLeftState={setShowLeftState}
              setShowRightState={setShowRightState}
              socket={socket}
              inputText={inputText}
              scrollToTopRef={scrollToTopRef}
              scrollToBottomRef={scrollToBottomRef}
            />
          )}
        </section>
        {matches960 ? (
           <div
            className="infoSectionDiv"
            style={{ maxWidth: 240 }}
          >
            <Info
              socket={socket}
            />
          </div>
        ) : (
          showRightState && (
             <div
              className="showAbsoluteSideBar rightSidebar"
              ref={rightSidebarWrapperRef}
            >
              <div className="chatContainer">
                <div
                  className="infoSectionDiv"
                  style={{
                    maxWidth: 240,
                  }}
                >
                  <div
                    className="hideTopNavDiv hideTopNavDivRight"
                    onClick={() => setShowRightState(false)}
                  >
                    {"Hide >"}
                  </div>
                  <Info
                    socket={socket}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

Chat.propTypes = {
  chosenChannel: PropTypes.string,

  addMessage: PropTypes.func.isRequired,
  addEditMessage: PropTypes.func.isRequired,
  addDeleteMessage: PropTypes.func.isRequired,
  addMessageReaction: PropTypes.func.isRequired,
  alreadyReacted: PropTypes.func.isRequired,
  setAllMessages: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  chosenChannel: state.groups.chosenChannel,
});

export default connect(mapStateToProps, {
  addMessage,
  addMessageReaction,
  alreadyReacted,
  setAllMessages,
})(Chat);
