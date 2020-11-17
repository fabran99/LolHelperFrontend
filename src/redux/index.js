import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import assetsReducer from "./assets/assets.reducer";
import lcuconnectorReducer from "./lcuConnector/lcuConnector.reducer";
import ingameReducer from "./ingame/ingame.reducer";
import settingsReducer from "./settings/settings.reducer";
import summonerReducer from "./summoner/summoner.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
  blacklist: ["assets", "ingame", "lcuConnector", "summoner"],
};

const rootReducer = combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  ingame: ingameReducer,
  settings: settingsReducer,
  summoner: summonerReducer,
});

export default persistReducer(persistConfig, rootReducer);
