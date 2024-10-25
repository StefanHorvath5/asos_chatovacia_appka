import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { removeAlert } from "../actions/alerts";

import "../css/Alert.css";

const Alert = ({ alertMessage, alertVariant, removeAlert }) => {
  const [colorVariant, setColorVariant] = useState("red");
  useEffect(() => {
    setColorVariant(
      alertVariant === "success"
        ? "green"
        : alertVariant === "warning"
        ? "orange"
        : "red"
    );
  }, [alertVariant]);
  return (
    <div className="alertContainer" style={{ backgroundColor: colorVariant }}>
      {alertMessage}
      <p className="removeAlertButton" onClick={removeAlert}>
        X
      </p>
    </div>
  );
};

Alert.propTypes = {
  alertVariant: PropTypes.string.isRequired,
  alertMessage: PropTypes.string.isRequired,
  removeAlert: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  alertVariant: state.alerts.variant,
  alertMessage: state.alerts.message,
});
export default connect(mapStateToProps, { removeAlert })(Alert);
