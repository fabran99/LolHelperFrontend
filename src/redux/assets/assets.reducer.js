import { GET_ASSETS, ERROR_GET_ASSETS } from "./assets.types";
import default_assets from "../../json/default_assets.json";

var currentVersion = process.env.REACT_APP_VERSION;
var initialState = {
  champions: null,
  ranking: null,
  lol_version: null,
  perks: null,
  runes: null,
  items: null,
  img_links: null,
  error: false,
  app_version: currentVersion,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS:
      var data = action.payload;
      data.app_version = currentVersion;

      data.champions = data.champions.filter(
        (item) => item.lanes && item.info_by_lane
      );

      // Si fallo del todo continuo con el state actual
      if (data.champions.length == 0) {
        return { ...state, error: true };
      }

      return {
        ...state,
        ...data,
        error: false,
      };
    case ERROR_GET_ASSETS:
      if (state.champions == null) {
        state = { ...default_assets };
      }
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};
