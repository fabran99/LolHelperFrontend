import { combineReducers } from "redux";
import assetsReducer from "./assets/assets.reducer";
import lcuconnectorReducer from "./lcuConnector/lcuConnector.reducer";
import ingameReducer from "./ingame/ingame.reducer";
import configReducer from "./config/config.reducer";
import summonerReducer from "./summoner/summoner.reducer";

export default combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  ingame: ingameReducer,
  configuration: configReducer,
  summoner: summonerReducer,
});
