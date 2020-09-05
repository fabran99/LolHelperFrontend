import { GET_ASSETS, ERROR_GET_ASSETS } from "../actions/types";
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

var cached_assets = window.localStorage.getItem("assets");

if (cached_assets) {
  var assetsObj = JSON.parse(cached_assets);

  if (
    !("app_version" in assetsObj) ||
    currentVersion != assetsObj.app_version ||
    !assetsObj.app_version
  ) {
    window.localStorage.removeItem("assets");
  } else {
    initialState = { ...initialState, ...JSON.parse(cached_assets) };
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS:
      var data = action.payload;
      data.app_version = currentVersion;
      window.localStorage.setItem("assets", JSON.stringify(data));
      return {
        ...state,
        ...data,
        error: false,
      };
    case ERROR_GET_ASSETS:
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};
