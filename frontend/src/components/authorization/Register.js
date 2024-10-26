import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { register } from "../../actions/auth";

import { InputContainer } from "../common/CustomComponents";

const Register = ({ isAuthenticated, register }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="registerContainer">
      {isAuthenticated && <Navigate to="/home" />}
      <div className="formContainer">
        <InputContainer>
          <label htmlFor="username">Username</label>
          <input
            autoFocus
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && username && password) {
                register(username, password);
              }
            }}
          />
        </InputContainer>
        <div className="buttonContainer">
          <button
            disabled={!username || !password}
            onClick={() => {
              register(username, password);
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

// Redux and default export
Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
