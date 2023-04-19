import { electron } from "../../helpers/outsideObjects";
import { INITIALIZE_LCU_CONNECTION_SOCKET } from "./lcuConnector.types";
import { take, put, call, fork } from "redux-saga/effects";
import { lcuConnect, lcuDisconnect } from "./lcuConnector.actions";
import { eventChannel } from "redux-saga";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onConnect = (event, data) => {
      return emit(lcuConnect(data));
    };
    const onDisconnect = (event, data) => {
      return emit(lcuDisconnect());
    };

    electron.ipcRenderer.on("LCU_CONNECT", onConnect);
    electron.ipcRenderer.on("LCU_DISCONNECT", onDisconnect);

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

export function* listenToLcuConnection() {
  yield take(INITIALIZE_LCU_CONNECTION_SOCKET);
  yield fork(read);
}
