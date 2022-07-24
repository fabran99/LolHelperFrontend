import { INITIALIZE_GET_ASSETS, STOP_GETTING_ASSETS } from "./assets.types";
import { getAssets, errorGetAssets } from "./assets.actions";
import { assetsUrls } from "../../endpoints/assets";
import { take, put, call, delay, race } from "redux-saga/effects";
import axios from "axios";

function* pollTask() {
  while (true) {
    // Busco assets cada un tiempo determinado
    try {
      const { data } = yield call(() =>
        axios.get(`${process.env.REACT_APP_HOST}${assetsUrls["get_assets"]}`)
      );
      yield put(getAssets(data));
      yield delay(1000 * 60 * 15);
    } catch (err) {
      console.log(err);
      yield put(errorGetAssets());
      yield delay(1000 * 10);
    }
  }
}

export function* startAssetPolling() {
  yield take(INITIALIZE_GET_ASSETS);
  yield race([call(pollTask), take(STOP_GETTING_ASSETS)]);
}
