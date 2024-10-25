import { createAlert } from "./alerts";

export const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const tokenConfig = (getState) => {
  const token = getState().auth.token;

  const authConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    authConfig.headers["Authorization"] = `${token}`;
  }
  return authConfig;
};

export const dispatchError = (err) => (dispatch) => {
  try {
    dispatch(
      createAlert({
        variant: "error",
        message: err.response.data.msg,
      })
    );
  } catch (r) {
    dispatch(
      createAlert({
        variant: "error",
        message: err,
      })
    );
  }
};

export const getCloudinaryUrlAndFormData = (type, signData, fileMessage) => {
  const url =
    "https://api.cloudinary.com/v1_1/" +
    signData.cloudname +
    `/upload`;
  const data = new FormData();
  data.append("api_key", signData.apikey);
  data.append("timestamp", signData.timestamp);
  data.append("signature", signData.signature);
  
  data.append("folder", "asos");
  data.append("file", fileMessage);
  return { url, data };
};
