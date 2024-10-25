export const api = "http://localhost:3000/";
export const frontendUrl = "http://localhost:3001/";

export const LOGIN_URL = api + "users/login";
export const REGISTER_URL = api + "users/register";
export const GET_USER_URL = api + "users/getUser";

export const CREATE_GROUP_URL = api + "groups/createGroup";
export const GET_ALL_GROUPS_URL = api + "groups/getAllGroups";
export const ADD_TO_GROUP_URL = api + "groups/addToGroup";
export const GET_GROUP_BY_ID_URL = (id) => {
  return api + `groups/${id}`;
};

export const CREATE_CHANNEL_URL = api + "channels/createChannel";

export const CLOUDINARY_SIGN_URL = api + "api/signuploadform";
