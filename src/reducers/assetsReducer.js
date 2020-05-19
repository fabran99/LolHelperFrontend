import { GET_ASSETS, ERROR_GET_ASSETS } from "../actions/types";

const initialState = {
  general: {
    content: null,
    error: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS:
      return {
        ...state,
        general: {
          content: action.payload,
          error: false,
        },
      };
    case ERROR_GET_ASSETS:
      return {
        ...state,
        general: {
          content: null,
          error: true,
        },
      };
    default:
      return state;
  }
};
