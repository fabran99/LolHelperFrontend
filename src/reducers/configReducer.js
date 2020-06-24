import { UPDATE_CONFIG } from "../actions/types";

var initialState = {
  autoNavigate: true,
  autoImportRunes: false,
  dontAutoImportRunesNow: false,
  autoAcceptMatch: false,
  changingRunes: false,
  autoAskLane: "",
};

var cached_config = window.localStorage.getItem("config");

if (cached_config) {
  initialState = { ...initialState, ...JSON.parse(cached_config) };
} else {
  window.localStorage.setItem("config", JSON.stringify(initialState));
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      var newConfig = {
        ...state,
        ...action.payload,
      };
      window.localStorage.setItem("config", JSON.stringify(newConfig));
      return newConfig;
    default:
      return state;
  }
};
