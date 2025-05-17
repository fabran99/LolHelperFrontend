import { UPDATE_CONFIG } from "./settings.types";

export var initialState = {
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
  gamePath: `C:\\Riot Games\\League of Legends`,
  // Configuration modal
  settingsVisible: false,
  settingVersion: "0.2.18",
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
