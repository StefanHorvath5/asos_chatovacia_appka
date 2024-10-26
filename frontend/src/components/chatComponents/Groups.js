import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  setCurrentGroup,
  getOldGroup
} from "../../actions/groups";


const Groups = ({
  socket,
  setModalGroupState,
  display,
  groups,
  setCurrentGroup,
  getOldGroup,
}) => {

  useEffect(() => {
    if (groups) {
      getOldGroup(socket);
    }
  }, [groups, getOldGroup, socket]);

  return (
    <>
      {display && (
        <div className="groupsNavContainer">
          <section className="listGroupsSection">
            <ul>
              {groups ? (
                <>
                  {groups.map((g) => {
                    return (
                      <div className="groupWrapper" key={g.group._id}>
                        <li
                          className={"groupLi"}
                          key={g.group._id}
                          onClick={() => setCurrentGroup(socket, g)}
                          title={g.group.name}
                        >
                          {g.group.name.substring(0, 3)}
                        </li>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p>0</p>
              )}

              <div className="groupWrapper">
                <li
                  className="groupLi"
                  onClick={() => setModalGroupState(true)}
                  title="Create or Join group"
                >
                  +
                </li>
              </div>
            </ul>
          </section>
        </div>
      )}
    </>
  );
};

Groups.propTypes = {
  groups: PropTypes.array,
  setCurrentGroup: PropTypes.func.isRequired,
  getOldGroup: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  groups: state.groups.groups,
});

export default connect(mapStateToProps, {
  setCurrentGroup,
  getOldGroup,
})(Groups);
