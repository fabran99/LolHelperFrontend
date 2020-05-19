import { NAV_TOGGLE } from "../actions/types";

const initialState = {
  visible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case NAV_TOGGLE:
      return {
        ...state,
        visible: !state.visible,
      };

    default:
      return state;
  }
};
