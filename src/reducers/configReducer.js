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
  autoImportBuild: true,
  dontAutoImportBuildNow: false,
  champSelectionVisibleData: "runes",
  savingBuild: false,
  // Version
};

var cached_config = window.localStorage.getItem("config");

if (cached_config) {
  var isOldConfig = false;
  // Si falta alguna key le pongo el default
  var currentConfig = JSON.parse(cached_config);
  Object.keys(initialState).forEach((key) => {
    if (!(key in currentConfig)) {
      isOldConfig = true;
      currentConfig[key] = initialState[key];
    }
  });

  // Si alguna estaba desactualizada entonces lo guardo en localStorage
  if (isOldConfig) {
    window.localStorage.setItem("config", JSON.stringify(currentConfig));
  }

  initialState = { ...initialState, ...currentConfig };
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
