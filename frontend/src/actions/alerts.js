import { CREATE_ALERT, REMOVE_ALERT } from "./types";

export const removeAlert = () => (dispatch) => {
  dispatch({
    type: REMOVE_ALERT,
  });
};

export const createAlert = (alrt) => (dispatch) => {
  if (typeof alrt.message === "object") {
    alrt.message = "Something went wrong try again later 2";
  }
  dispatch({
    type: CREATE_ALERT,
    payload: alrt,
  });
  setTimeout(() => {
    dispatch(removeAlert());
  }, 5000);
};
