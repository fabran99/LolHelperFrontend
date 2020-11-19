import { electron } from "../../helpers/outsideObjects";
import { INITIALIZE_LOBBY_SOCKET } from "./lobby.types";
import { take, put, call, fork } from "redux-saga/effects";
import { lobbyChange } from "./lobby.actions";
import { eventChannel } from "redux-saga";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(lobbyChange(data));
    };
    electron.ipcRenderer.on("LOBBY_CHANGE", onMessage);

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

export function* listenToLobby() {
  yield take(INITIALIZE_LOBBY_SOCKET);
  yield fork(read);
}
