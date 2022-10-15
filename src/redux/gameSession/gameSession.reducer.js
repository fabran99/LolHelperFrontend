import { GAMESESSION_CHANGE, CLEAN_GAMESESSION } from "./gameSession.types";

const initialState = {
  phase: "None",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAMESESSION_CHANGE:
      let newData = {
        ...state,
        ...action.payload,
      };
      return newData;
    case CLEAN_GAMESESSION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
