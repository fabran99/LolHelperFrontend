import { createSelector } from "reselect";

const selectLcuConnector = (state) => state.lcuConnector;

export const selectLcuIsConnected = createSelector(
  [selectLcuConnector],
  (lcuConnector) => lcuConnector.connected
);

export const selectLcuConnection = createSelector(
  [selectLcuConnector],
  (lcuConnector) => lcuConnector.connection
);
