import { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { frontendUrl } from "../../urls";

import {
  addToGroup,
  createGroup,
} from "../../actions/groups";
import { createChannel } from "../../actions/channels";

import {
  ModalContainer,
  ModalNav,
  ModalContent,
  ModalButtons,
  InputContainer,
} from "./CustomComponents";

import "./modals.css";

const GroupModalNotConnected = ({
  matches768,
  createGroup,
  addToGroup,
  close,
}) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [addToGroupId, setAddToGroupId] = useState("");
  const [addToGroupColor, setAddToGroupColor] = useState("#ffffff");
  const [state, setState] = useState(1);
  return (
    <ModalContainer
      matches768={matches768}
      close={() => {
        close();
        setNewGroupName("");
        setAddToGroupId("");
        setAddToGroupColor("#ffffff");
      }}
    >
      <ModalNav>
        <div
          className="groupModalNavDiv"
          onClick={() => {
            setState(1);
            setNewGroupName("");
            setAddToGroupId("");
            setAddToGroupColor("#ffffff");
          }}
        >
          Create server
        </div>
        <div
          className="groupModalNavDiv"
          onClick={() => {
            setState(0);
            setNewGroupName("");
            setAddToGroupId("");
            setAddToGroupColor("#ffffff");
          }}
        >
          Join server
        </div>
      </ModalNav>
      <ModalContent>
        {state ? (
          <>
            <InputContainer>
              <label htmlFor="newGroupName">Group name</label>
              <input
                autoFocus
                type="text"
                id="newGroupName"
                name="newGroupName"
                value={newGroupName}
                placeholder="Group name"
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newGroupName) {
                    createGroup(newGroupName);
                    setNewGroupName("");
                    close();
                  }
                }}
              />
            </InputContainer>

            <ModalButtons>
              <button
                className="modalButton submitButton"
                disabled={!newGroupName}
                onClick={() => {
                  createGroup(newGroupName);
                  setNewGroupName("");
                  close();
                }}
              >
                Create Group
              </button>
              <button
                className="modalButton"
                onClick={(e) => {
                  // e.stopPropagation();
                  close();
                  setNewGroupName("");
                }}
              >
                Cancel
              </button>
            </ModalButtons>
          </>
        ) : (
          <>
            <InputContainer>
              <label htmlFor="addToGroupId">Group id</label>
              <input
                autoFocus
                id="addToGroupId"
                type="text"
                name="addToGroupId"
                value={addToGroupId}
                placeholder="Group Id"
                onChange={(e) => setAddToGroupId(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && addToGroupId) {
                    addToGroup(addToGroupId, addToGroupColor);
                    setAddToGroupId("");
                    setAddToGroupColor("#ffffff");
                    close();
                  }
                }}
              />
            </InputContainer>
            
            <ModalButtons>
              <button
                className="modalButton submitButton"
                disabled={!addToGroupId}
                onClick={() => {
                  addToGroup(addToGroupId, addToGroupColor);
                  setAddToGroupId("");
                  setAddToGroupColor("#ffffff");
                  close();
                }}
              >
                Add to group
              </button>
              <button
                className="modalButton"
                onClick={() => {
                  close();
                  setAddToGroupId("");
                  setAddToGroupColor("#ffffff");
                }}
              >
                Cancel
              </button>
            </ModalButtons>
          </>
        )}
      </ModalContent>
    </ModalContainer>
  );
};

GroupModalNotConnected.propTypes = {
  createGroup: PropTypes.func.isRequired,
  addToGroup: PropTypes.func.isRequired,
};

export const GroupModal = connect(null, {
  createGroup,
  addToGroup,
})(GroupModalNotConnected);

const ChannelModalNotConnected = ({
  matches768,
  close,
  createChannel,
  chosenGroup,
}) => {
  const [newChannelName, setNewChannelName] = useState("");
  return (
    <ModalContainer
      matches768={matches768}
      close={() => {
        setNewChannelName("");
        close();
      }}
    >
      <ModalNav>
        <span>Create channel</span>
      </ModalNav>
      <ModalContent>
        <InputContainer>
          <label htmlFor="newChannelName">Channel name</label>
          <input
            autoFocus
            id="newChannelName"
            type="text"
            name="newChannelName"
            value={newChannelName}
            placeholder="Channel name"
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && newChannelName) {
                createChannel(chosenGroup.group._id, newChannelName);
                setNewChannelName("");
                close();
              }
            }}
          />
        </InputContainer>

        <ModalButtons>
          <button
            className="modalButton submitButton"
            disabled={!newChannelName}
            onClick={() => {
              createChannel(chosenGroup.group._id, newChannelName);
              setNewChannelName("");
              close();
            }}
          >
            Create Channel
          </button>
          <button
            className="modalButton"
            onClick={() => {
              setNewChannelName("");
              close();
            }}
          >
            Cancel
          </button>
        </ModalButtons>
      </ModalContent>
    </ModalContainer>
  );
};

ChannelModalNotConnected.propTypes = {
  createChannel: PropTypes.func.isRequired,
  chosenGroup: PropTypes.object,
};
const mapStateToProps = (state) => ({
  chosenGroup: state.groups.chosenGroup,
});

export const ChannelModal = connect(mapStateToProps, {
  createChannel,
})(ChannelModalNotConnected);

const GroupSettingsModalNotConnected = ({
  close,
  matches768,
  chosenGroup
}) => {

  return (
    <ModalContainer
      matches768={matches768}
      close={() => {
        close();
      }}
    >
      <ModalNav>
        <div
          className="groupModalNavDiv"
        >
          Server Info
        </div>
      </ModalNav>
      <ModalContent>
          <>
            <InputContainer>
              <label>Group join Link</label>
              <p
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  navigator.clipboard.writeText(
                    `${frontendUrl}groupJoin/${chosenGroup.group._id}`
                  );
                  e.target.style.color = "lightgreen";
                }}
              >{`${frontendUrl}groupJoin/${chosenGroup.group._id}`}</p>
            </InputContainer>
          </>
      </ModalContent>
    </ModalContainer>
  );
};

GroupSettingsModalNotConnected.propTypes = {
  chosenGroup: PropTypes.object
};
const mapStateToProps2 = (state) => ({
  chosenGroup: state.groups.chosenGroup,
});

export const GroupSettingsModal = connect(mapStateToProps2, {
  addToGroup,
})(GroupSettingsModalNotConnected);
