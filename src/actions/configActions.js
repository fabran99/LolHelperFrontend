import { UPDATE_CONFIG } from "./types";

export const updateConfig = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_CONFIG,
    payload: data,
  });
};
