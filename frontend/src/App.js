import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadUser } from "./actions/auth";

import PrivateRoute from "./components/authorization/PrivateRoute";

import Register from "./components/authorization/Register";
import Login from "./components/authorization/Login";
import Home from "./components/Home";
import Header from "./components/common/Header";
import JoinGroup from "./components/group/JoinGroup";
import Alert from "./components/common/Alert";

import "./App.css";

function App({ auth, loadUser, alertState }) {
  const { isLoading, isAuthenticated } = auth;

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="appContainer">
      {isLoading || (localStorage.getItem("token") && !isAuthenticated) ? (
        <div>Loadin...</div>
      ) : (
        <Router>
          {!isAuthenticated && <Header />}

          <Routes>
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/groupJoin/:gId" element={<PrivateRoute><JoinGroup /></PrivateRoute>} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      )}

      {alertState && <Alert />}
    </div>
  );
}

App.propTypes = {
  auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
  alertState: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  alertState: state.alerts.state,
});

export default connect(mapStateToProps, { loadUser })(App);
