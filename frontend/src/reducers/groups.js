import {
  GROUPS_LOADED,
  GROUPS_LOADING,
  GROUPS_ERROR,
  ADD_TO_GROUP_ERROR,
  GROUPS_LOGOUT,
  GROUP_CREATED,
  GROUP_CHOSEN,
  CHANNEL_CHOSEN
} from "../actions/types";

const initialState = {
  isLoading: false,
  groups: null,
  chosenGroup: null,
  chosenChannel: null,
};

export default function groups(state = initialState, action) {
  switch (action.type) {
    case GROUPS_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case GROUP_CREATED:
    case GROUPS_LOADED:
      return {
        ...state,
        groups: [...action.payload.groups],
        isLoading: false,
      };
    case ADD_TO_GROUP_ERROR:
      return {
        ...state,
        isLoading: false,
      };
    case GROUP_CHOSEN:
      localStorage.setItem("chosenGroup", action.payload.group._id);
      return {
        ...state,
        chosenGroup: action.payload,
        chosenChannel: null,
      };
    case CHANNEL_CHOSEN:
      localStorage.setItem("chosenChannel", action.payload);
      return {
        ...state,
        chosenChannel: action.payload,
      };
    case GROUPS_LOGOUT:
    case GROUPS_ERROR:
      localStorage.removeItem("chosenGroup");
      localStorage.removeItem("chosenChannel");
      return {
        ...state,
        groups: null,
        isLoading: false,
        chosenGroup: null,
        chosenChannel: null,
      };
    default:
      return state;
  }
}
