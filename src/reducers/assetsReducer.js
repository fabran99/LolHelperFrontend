import { GET_ASSETS, ERROR_GET_ASSETS } from "../actions/types";

var initialState = {
  champions: null,
  ranking: null,
  lol_version: null,
  perks: null,
  runes: null,
  items: null,
  img_links: null,
  error: false,
};

var cached_assets = window.localStorage.getItem("assets");

if (cached_assets) {
  initialState = { ...initialState, ...JSON.parse(cached_assets) };
}
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ASSETS:
      window.localStorage.setItem("assets", JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
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
