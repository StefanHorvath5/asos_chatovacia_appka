import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { logout } from "../../actions/auth";


import "../../css/Info.css";

const Info = ({
  socket,
  logout,
}) => {
  return (
    <div className="infoContainer">
      <div className="infoButtonOutsideContainer">
        <div className="infoButtonContainer">
          <button className="infoButton" onClick={() => logout(socket)}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

Info.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout })(Info);
