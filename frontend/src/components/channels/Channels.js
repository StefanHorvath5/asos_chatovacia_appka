import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { setCurrentChannel, getOldChannel } from "../../actions/channels";

import s from "../../images/settings.svg";

const Channels = ({
  socket,
  setModalChannelState,
  setModalGroupSettingsState,
  display,
  setShowLeftState,
  chosenGroup,
  chosenChannel,
  setCurrentChannel,
  getOldChannel,
}) => {
  useEffect(() => {
    if (chosenGroup && Object.keys(chosenGroup).length !== 0) {
      getOldChannel(socket);
    }
  }, [chosenGroup, getOldChannel, socket]);
  return (
    <>
      {display && chosenGroup && Object.keys(chosenGroup).length !== 0 && (
        <div>
          <div
            className="chosenGroupNameDiv"
            onClick={() => setModalGroupSettingsState(true)}
          >
            <div className="chosenGroupName">{chosenGroup.group.name}</div>
            <div>
              <img
                src={s}
                alt="S"
                width="20"
                height="20"
                className="settingsIcon"
              />
            </div>
          </div>
          <ul>
            {chosenGroup.group.channels ? (
              chosenGroup.group.channels.map((ch) => {
                return (
                  <li
                    key={ch._id}
                    onClick={() => {
                      setCurrentChannel(socket, ch._id);
                      if (setShowLeftState) setShowLeftState(false);
                    }}
                    className={
                      chosenChannel && chosenChannel === ch._id
                        ? "normalChannel activeChannel"
                        : "normalChannel"
                    }
                  >
                    <span className="channelHash">#</span>
                    {ch.name}
                  </li>
                );
              })
            ) : (
              <li>No channels</li>
            )}
            <li
              onClick={() => setModalChannelState(true)}
              className="addChannelLi"
            >
              +
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

Channels.propTypes = {
  chosenGroup: PropTypes.object,
  chosenChannel: PropTypes.string,
  setCurrentChannel: PropTypes.func.isRequired,
  getOldChannel: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  chosenGroup: state.groups.chosenGroup,
  chosenChannel: state.groups.chosenChannel,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  getOldChannel,
})(Channels);
