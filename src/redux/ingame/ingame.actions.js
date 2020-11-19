import {
  UPDATE_GAMEINFO,
  INITIALIZE_CURRENT_GAME_SOCKET,
  CLEAN_GAMEINFO,
  STOP_FETCHING_CURRENT_GAME,
  START_FETCHING_CURRENT_GAME,
} from "./ingame.types";
import { electron } from "../../helpers/outsideObjects";

export const updateGameInfo = (data) => ({
  type: UPDATE_GAMEINFO,
  payload: data,
});

export const cleanGameInfo = () => ({
  type: CLEAN_GAMEINFO,
});

export const initializeCurrentGameSocket = () => ({
  type: INITIALIZE_CURRENT_GAME_SOCKET,
});

export const stopFetchingCurrentGame = () => (dispatch) => {
  electron.ipcRenderer.send("STOP_FETCHING_CURRENT_GAME", true);

  dispatch({
    type: STOP_FETCHING_CURRENT_GAME,
  });
};
export const startFetchingCurrentGame = () => (dispatch) => {
  electron.ipcRenderer.send("START_FETCHING_CURRENT_GAME", true);

  dispatch({
    type: START_FETCHING_CURRENT_GAME,
  });
};
