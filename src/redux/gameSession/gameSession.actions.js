import { GAMESESSION_CHANGE } from "./gameSession.types";

export const gameSessionChange = ({ data }) => ({
  type: GAMESESSION_CHANGE,
  payload: data,
});
