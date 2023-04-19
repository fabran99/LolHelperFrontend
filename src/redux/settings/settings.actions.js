import {
  UPDATE_CONFIG,
  INITIALIZE_BUILD_APPLIED_EVENT,
  INITIALIZE_BUILD_FAILED_EVENT,
} from "./settings.types";

export const updateConfig = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_CONFIG,
    payload: data,
  });
};

export const initializeBuildAppliedEvent = () => (dispatch) => {
  dispatch({
    type: INITIALIZE_BUILD_APPLIED_EVENT,
  });
};

export const initializeBuildFailedEvent = () => (dispatch) => {
  dispatch({
    type: INITIALIZE_BUILD_FAILED_EVENT,
  });
};
