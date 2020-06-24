import { combineReducers } from "redux";
import assetsReducer from "./assetsReducer";
import lcuconnectorReducer from "./lcuconnectorReducer";
import ingameReducer from "./ingameReducer";
import configReducer from "./configReducer";

export default combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  inGame: ingameReducer,
  configuration: configReducer,
});
