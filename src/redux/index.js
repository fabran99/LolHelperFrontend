import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import assetsReducer from "./assets/assets.reducer";
import lcuconnectorReducer from "./lcuConnector/lcuConnector.reducer";
import ingameReducer from "./ingame/ingame.reducer";
import settingsReducer from "./settings/settings.reducer";
import summonerReducer from "./summoner/summoner.reducer";
import lobbyReducer from "./lobby/lobby.reducer";
import gameSessionReducer from "./gameSession/gameSession.reducer";
import champSelectReducer from "./champSelect/champSelect.reducer";
import playersReducer from "./players/players.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
  blacklist: [
    "ingame",
    "lcuConnector",
    "summoner",
    "lobby",
    "gameSession",
    "champSelect",
    "players",
  ],
};

const rootReducer = combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  ingame: ingameReducer,
  settings: settingsReducer,
  summoner: summonerReducer,
  lobby: lobbyReducer,
  gameSession: gameSessionReducer,
  champSelect: champSelectReducer,
  players: playersReducer,
});

export default persistReducer(persistConfig, rootReducer);
