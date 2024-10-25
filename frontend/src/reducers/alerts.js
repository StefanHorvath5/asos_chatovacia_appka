import { CREATE_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = {
  variant: "warning",
  message: "",
  state: false,
};

export default function alerts(state = initialState, action) {
  switch (action.type) {
    case REMOVE_ALERT:
      return {
        ...state,
        state: false,
      };
    case CREATE_ALERT:
      return {
        ...action.payload,
        state: true,
      };
    default:
      return state;
  }
}
