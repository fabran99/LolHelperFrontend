import { UPDATE_GAMEINFO } from "./ingame.types";

export const updateGameinfo = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_GAMEINFO,
    payload: data,
  });
};
