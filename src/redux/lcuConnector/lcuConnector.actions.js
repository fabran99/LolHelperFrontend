import {
  INITIALIZE_LCU_CONNECTION_SOCKET,
  LCU_CONNECT,
  LCU_DISCONNECT,
} from "./lcuConnector.types";
import { updateSummoner, cleanSummoner } from "../summoner/summoner.actions";
import { cleanGameInfo } from "../ingame/ingame.actions";
import { cleanGameSession } from "../gameSession/gameSession.actions";
import { cleanChampSelect } from "../champSelect/champSelect.actions";
import { cleanLobby } from "../lobby/lobby.actions";

export const lcuConnect = (data) => (dispatch) => {
  dispatch({
    type: LCU_CONNECT,
    payload: data,
  });

  dispatch(updateSummoner(data, 0));
};

export const lcuDisconnect = () => (dispatch) => {
  dispatch({ type: LCU_DISCONNECT });
  dispatch(cleanSummoner());
  dispatch(cleanGameInfo());
  dispatch(cleanGameSession());
  dispatch(cleanChampSelect());
  dispatch(cleanLobby());
};

export const initializeLcuConnSocket = () => ({
  type: INITIALIZE_LCU_CONNECTION_SOCKET,
});
