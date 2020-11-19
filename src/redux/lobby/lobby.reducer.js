import { LOBBY_CHANGE, CLEAN_LOBBY } from "./lobby.types";

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case LOBBY_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAN_LOBBY:
      return null;
    default:
      return state;
  }
};
