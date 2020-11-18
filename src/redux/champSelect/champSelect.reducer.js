import { CHAMPSELECT_CHANGE } from "./champSelect.types";

const initialState = null;

export default (state = initialState, action) => {
  switch (action.type) {
    case CHAMPSELECT_CHANGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
