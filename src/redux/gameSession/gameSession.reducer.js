import { GAMESESSION_CHANGE } from "./gameSession.types";

const initialState = {
  phase: "None",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAMESESSION_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
