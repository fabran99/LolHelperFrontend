import { all, call } from "redux-saga/effects";
import { listenToLcuConnection } from "./lcuConnector/lcuConnector.saga";
import { listenToGameSession } from "./gameSession/gameSession.saga";
import { listenToChampSelect } from "./champSelect/champSelect.saga";
import { listenToLobby } from "./lobby/lobby.saga";
import { listenToGameData } from "./ingame/ingame.saga";

export default function* rootSaga() {
  yield all([
    call(listenToLcuConnection),
    call(listenToGameSession),
    call(listenToChampSelect),
    call(listenToLobby),
    call(listenToGameData),
  ]);
}
