import { CHAMPSELECT_CHANGE, CLEAN_CHAMPSELECT } from "./champSelect.types";

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case CHAMPSELECT_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAN_CHAMPSELECT:
      return null;
    default:
      return state;
  }
};
