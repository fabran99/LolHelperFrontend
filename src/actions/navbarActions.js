import { NAV_TOGGLE } from "./types";

export const navToggle = () => (dispatch) => {
  dispatch({
    type: NAV_TOGGLE,
  });
};
