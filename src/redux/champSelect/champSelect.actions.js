import { CHAMPSELECT_CHANGE } from "./champSelect.types";

export const champSelectChange = ({ data }) => ({
  type: CHAMPSELECT_CHANGE,
  payload: data,
});
