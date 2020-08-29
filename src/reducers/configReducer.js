import { UPDATE_CONFIG } from "../actions/types";

var initialState = {
  // General
  autoNavigate: true,
  // Lane
  autoAskLane: "",
  // Runes
  autoImportRunes: false,
  dontAutoImportRunesNow: false,
  autoAcceptMatch: false,
  changingRunes: false,
  laneSelectedForRecommendations: "",
  // Build
  autoImportBuild: false,
  dontAutoImportBuildNow: false,
  champSelectionVisibleData: "runes",
  savingBuild: false,
};

var cached_config = window.localStorage.getItem("config");

if (cached_config) {
  initialState = { ...initialState, ...JSON.parse(cached_config) };
  initialState.autoAskLane = "";
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
