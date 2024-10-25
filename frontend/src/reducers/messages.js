import {
  MESSAGES_LOADING,
  MESSAGES_LOADED,
  MESSAGES_ERROR,
  NEW_MESSAGE,
  ALL_MESSAGES,
  SENDING_FILE,
  END_SENDING_FILE,
  NEW_REACTION_MESSAGE,
  ALREADY_REACTED_MESSAGE,
  WAITING_REACTION_MESSAGE,
} from "../actions/types";

const initialState = {
  messages: [],
  isLoading: false,
  fileMessageLoading: null,
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case MESSAGES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ALL_MESSAGES:
    case MESSAGES_LOADED:
      return {
        ...state,
        messages: action.payload.messages,
        isLoading: false,
      };
    case SENDING_FILE:
      return {
        ...state,
        isLoading: true,
        fileMessageLoading: action.payload,
      };
    case END_SENDING_FILE:
      return {
        ...state,
        isLoading: true,
        fileMessageLoading: null,
      };
    case MESSAGES_ERROR:
      return {
        ...state,
        isLoading: false,
        messages: [],
        fileMessageLoading: null,
      };
    case NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isLoading: false,
      };
    case NEW_REACTION_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((x) => {
          if (x._id === action.payload._id) {
            return action.payload;
          }
          return x;
        }),
        isLoading: false,
      };
    case WAITING_REACTION_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((x) => {
          if (x._id === action.payload._id) {
            return action.payload;
          }
          return x;
        }),
      };
    case ALREADY_REACTED_MESSAGE:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
