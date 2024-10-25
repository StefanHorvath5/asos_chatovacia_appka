import { combineReducers } from "redux";
import auth from "./auth";
import messages from "./messages";
import alerts from "./alerts";
import groups from "./groups";

export default combineReducers({
  alerts,
  messages,
  auth,
  groups,
});
