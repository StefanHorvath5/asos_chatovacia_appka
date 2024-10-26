import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import store from "../store";
import { io } from "socket.io-client";

import { api } from "../urls";

import { getAllGroups } from "../actions/groups";
import { createAlert } from "../actions/alerts";

import Chat from "./chat/Chat";
import {
  GroupModal,
  ChannelModal,
  GroupSettingsModal,
} from "./common/modals";

let socket;

function Home({
  isAuthenticated,
  createAlert,
}) {
  const [matches768, setMatches768] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  const [matches960, setMatches960] = useState(
    window.matchMedia("(min-width: 960px)").matches
  );
  const [matches1200, setMatches1200] = useState(
    window.matchMedia("(min-width: 1200px)").matches
  );

  const [loadSocket, setLoadSocket] = useState(false);
  const [modalGroupState, setModalGroupState] = useState(false);
  const [modalChannelState, setModalChannelState] = useState(false);
  const [modalGroupSettingsState, setModalGroupSettingsState] = useState(false);

  useEffect(() => {
    const handler = (e, setMatches) => setMatches(e.matches);
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => handler(e, setMatches768));
    window
      .matchMedia("(min-width: 960px)")
      .addEventListener("change", (e) => handler(e, setMatches960));
    window
      .matchMedia("(min-width: 1200px)")
      .addEventListener("change", (e) => handler(e, setMatches1200));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      socket = io(api, {
        extraHeaders: {
          Authorization: store.getState().auth.token,
        },
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      socket.on("connect", () => {
        setLoadSocket(true);
        socket.emit("joinMyGroupRooms");
      });
      socket.on("errorOccured", (errorMsg) => {
        createAlert({
          variant: "error",
          message: errorMsg,
        });
      });
    }
    return () => {
      socket.off("connect");
      socket.off("errorOccured");
    };
  }, [isAuthenticated, createAlert]);


  return (
    <>
      <div
        className={
          modalGroupState ||
          modalChannelState ||
          modalGroupSettingsState 
            ? "homeContainer disabledHome"
            : "homeContainer"
        }
      >
        {!isAuthenticated && <Navigate to="/login" />}
        {loadSocket && socket && socket.connected ? (
          <Chat
            socket={socket}
            setModalGroupState={setModalGroupState}
            setModalChannelState={setModalChannelState}
            setModalGroupSettingsState={setModalGroupSettingsState}
            matches768={matches768}
            matches960={matches960}
            matches1200={matches1200}
          />
        ) : (
          <div>Loading</div>
        )}
      </div>
      {modalGroupState && (
        <GroupModal
          matches768={matches768}
          close={() => setModalGroupState(false)}
        />
      )}
      {modalChannelState && (
        <ChannelModal
          matches768={matches768}
          close={() => setModalChannelState(false)}
        />
      )}
      {modalGroupSettingsState && (
        <GroupSettingsModal
          matches768={matches768}
          close={() => setModalGroupSettingsState(false)}
          socket={socket}
        />
      )}
      
      {(modalGroupState ||
        modalChannelState ||
        modalGroupSettingsState) && (
        <div className="homeOpacityLayerContainer">
          <div className="homeOpacityLayer"></div>
        </div>
      )}
    </>
  );
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool,  
  createAlert: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {
  getAllGroups,
  createAlert,
})(Home);
