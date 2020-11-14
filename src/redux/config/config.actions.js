import { UPDATE_CONFIG } from "./config.types";

export const updateConfig = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_CONFIG,
    payload: data,
  });
};
