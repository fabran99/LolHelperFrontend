import { electron } from "../../helpers/outsideObjects";
import { INITIALIZE_GAME_SESSION_SOCKET } from "./gameSession.types";
import { take, put, call, fork } from "redux-saga/effects";
import { gameSessionChange } from "./gameSession.actions";
import { eventChannel } from "redux-saga";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(gameSessionChange(data));
    };
    electron.ipcRenderer.on("GAMESESSION_CHANGE", onMessage);

    return () => {};
  });
}

function* read() {
  const channel = yield call(subscribe);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

export function* listenToGameSession() {
  yield take(INITIALIZE_GAME_SESSION_SOCKET);
  yield fork(read);
}
