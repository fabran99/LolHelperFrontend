import {
  CHAMPSELECT_CHANGE,
  INITIALIZE_CHAMP_SELECT_SOCKET,
  CLEAN_CHAMPSELECT,
} from "./champSelect.types";

export const champSelectChange = ({ data }) => ({
  type: CHAMPSELECT_CHANGE,
  payload: data,
});

export const initializeChampSelectSocket = () => ({
  type: INITIALIZE_CHAMP_SELECT_SOCKET,
});
export const cleanChampSelect = () => ({
  type: CLEAN_CHAMPSELECT,
});
