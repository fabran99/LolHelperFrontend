import { UPDATE_CONFIG } from "./settings.types";

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
  // Configuration modal
  settingsVisible: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CONFIG:
      var newConfig = {
        ...state,
        ...action.payload,
      };
      return newConfig;
    default:
      return state;
  }
};
