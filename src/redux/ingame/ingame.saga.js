import { electron } from "../../helpers/outsideObjects";
import { INITIALIZE_CURRENT_GAME_LISTENER } from "./ingame.types";
import { take, put, call, fork } from "redux-saga/effects";
import { updateGameInfo } from "./ingame.actions";
import { eventChannel } from "redux-saga";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(updateGameInfo(data));
    };
    electron.ipcRenderer.on("CURRENT_GAME_CHANGE", onMessage);

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

export function* listenToGameData() {
  yield take(INITIALIZE_CURRENT_GAME_LISTENER);
  yield fork(read);
}
