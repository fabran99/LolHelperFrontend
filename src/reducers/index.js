import { combineReducers } from "redux";
import assetsReducer from "./assetsReducer";
import lcuconnectorReducer from "./lcuconnectorReducer";

export default combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
});
