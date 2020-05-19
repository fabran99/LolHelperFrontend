import { combineReducers } from "redux";
import assetsReducer from "./assetsReducer";
import navbarReducer from "./navbarReducer";
import lcuconnectorReducer from "./lcuconnectorReducer";

export default combineReducers({
  assets: assetsReducer,
  lcuConnector: lcuconnectorReducer,
  navbar: navbarReducer,
});
