import { UPDATE_GAMEINFO } from "./ingame.types";

export const updateGameinfo = ({ data }) => ({
  type: UPDATE_GAMEINFO,
  payload: data,
});
