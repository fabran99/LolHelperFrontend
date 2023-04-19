import { electron } from "../../helpers/outsideObjects";
import { INITIALIZE_CHAMP_SELECT_SOCKET } from "./champSelect.types";
import { take, put, call, fork } from "redux-saga/effects";
import { champSelectChange } from "./champSelect.actions";
import { eventChannel } from "redux-saga";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(champSelectChange(data));
    };
    electron.ipcRenderer.on("CHAMPSELECT_CHANGE", onMessage);

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

export function* listenToChampSelect() {
  yield take(INITIALIZE_CHAMP_SELECT_SOCKET);
  yield fork(read);
}
