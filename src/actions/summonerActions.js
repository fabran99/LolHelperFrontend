import { UPDATE_SUMMONER } from "./types";

export const updateSummoner = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_SUMMONER,
    payload: data,
  });
};
