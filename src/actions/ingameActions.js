import { UPDATE_GAMEINFO } from "./types";

export const updateGameinfo = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_GAMEINFO,
    payload: data,
  });
};
