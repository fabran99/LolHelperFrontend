import { electron } from "../../helpers/outsideObjects";
import {
  INITIALIZE_BUILD_APPLIED_EVENT,
  INITIALIZE_BUILD_FAILED_EVENT,
} from "./settings.types";
import { take, put, call, fork } from "redux-saga/effects";
import { updateConfig } from "./settings.actions";
import { eventChannel } from "redux-saga";
import { toast } from "react-toastify";

export function* subscribeBuildApplied() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      toast.info("Build importada con exito", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.log("llega mensaje");
      return emit(updateConfig({ savingBuild: false }));
    };
    electron.ipcRenderer.on("BUILD_APPLIED", onMessage);

    return () => {};
  });
}

function* readBuildApplied() {
  const channel = yield call(subscribeBuildApplied);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

export function* listenToBuildApplied() {
  yield take(INITIALIZE_BUILD_APPLIED_EVENT);
  yield fork(readBuildApplied);
}

// Falla al importar build

export function* subscribeBuildFailed() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      toast.error("No se pudo importar la build correctamente", {
        position: "bottom-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return emit(updateConfig({ savingBuild: false }));
    };
    electron.ipcRenderer.on("BUILD_FAILED", onMessage);

    return () => {};
  });
}

function* readBuildFailed() {
  const channel = yield call(subscribeBuildFailed);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

export function* listenToBuildFailed() {
  yield take(INITIALIZE_BUILD_FAILED_EVENT);
  yield fork(readBuildFailed);
}
