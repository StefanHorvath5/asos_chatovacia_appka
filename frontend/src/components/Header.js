import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CustomLink } from "./CustomComponents";

import "../css/Header.css";

const Header = ({ isAuthenticated }) => {
  return (
    <div className="headerContainer">
      {isAuthenticated ? (
        <div className="authenticatedContainer">
          <CustomLink className="headerLink" to="/home">
            Home
          </CustomLink>
        </div>
      ) : (
        <>
          <CustomLink className="headerLink" to="/login">
            Login
          </CustomLink>
          <CustomLink className="headerLink" to="/register">
            Register
          </CustomLink>
        </>
      )}
    </div>
  );
};

// Redux and default export
Header.propTypes = {
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps)(Header);
