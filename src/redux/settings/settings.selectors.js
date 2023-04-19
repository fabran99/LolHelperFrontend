import { createSelector } from "reselect";

const selectSettings = (state) => state.settings;

export const selectSettingsVisible = createSelector(
  [selectSettings],
  (settings) => settings.settingsVisible
);

export const selectAutoAskLane = createSelector(
  [selectSettings],
  (settings) => settings.autoAskLane
);

export const selectLaneSelectedForRecommendations = createSelector(
  [selectSettings],
  (settings) => settings.laneSelectedForRecommendations
);
