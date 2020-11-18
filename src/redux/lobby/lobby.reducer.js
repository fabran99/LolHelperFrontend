import { LOBBY_CHANGE } from "./lobby.types";

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case LOBBY_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
