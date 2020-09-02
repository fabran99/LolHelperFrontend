import { combineReducers } from "redux";
import assetsReducer from "./assetsReducer";
import lcuconnectorReducer from "./lcuconnectorReducer";
import ingameReducer from "./ingameReducer";
import configReducer from "./configReducer";
import summonerReducer from "./summonerReducer";

export default combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  ingame: ingameReducer,
  configuration: configReducer,
  summoner: summonerReducer,
});
