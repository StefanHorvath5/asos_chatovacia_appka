import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

import { login } from "../actions/auth";

import { InputContainer } from "./CustomComponents";

import "../css/RegisterLogin.css";

const Login = ({ isAuthenticated, login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="loginContainer">
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
                login(username, password);
              }
            }}
          />
        </InputContainer>
        <div className="buttonContainer">
          <button
            disabled={!username || !password}
            onClick={() => {
              login(username, password);
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
