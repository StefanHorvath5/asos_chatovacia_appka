import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { addToGroup, getGroupById } from "../actions/groups";

import Header from "./Header";

const JoinGroup = ({ match, addToGroup, getGroupById }) => {
  const navigate = useNavigate();
  const gId = match.params.gId;
  const [groupToJoin, setGroupToJoin] = useState(null);

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await getGroupById(gId);
      setGroupToJoin(response);
    }
    fetchMyAPI();
  }, [gId, getGroupById]);

  return (
    <>
      <Header />
      {groupToJoin ? (
        <>
          <div>Do you really want to join this group?</div>
          <div>{groupToJoin.name}</div>
          <button
            onClick={() => {
              addToGroup(groupToJoin._id);
              navigate(`/home`);
            }}
          >
            Yes
          </button>
        </>
      ) : (
        <div>wait</div>
      )}
    </>
  );
};

JoinGroup.propTypes = {
  addToGroup: PropTypes.func.isRequired,
  getGroupById: PropTypes.func.isRequired,
};

export default connect(null, { addToGroup, getGroupById })(JoinGroup);
