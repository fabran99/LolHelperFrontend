import {
  GAMESESSION_CHANGE,
  INITIALIZE_GAME_SESSION_SOCKET,
  CLEAN_GAMESESSION,
} from "./gameSession.types";

export const gameSessionChange = ({ data }) => ({
  type: GAMESESSION_CHANGE,
  payload: data,
});

export const initializeGameSessionSocket = () => ({
  type: INITIALIZE_GAME_SESSION_SOCKET,
});
export const cleanGameSession = () => ({
  type: CLEAN_GAMESESSION,
});
