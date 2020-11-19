import {
  LOBBY_CHANGE,
  INITIALIZE_LOBBY_SOCKET,
  CLEAN_LOBBY,
} from "./lobby.types";

export const lobbyChange = ({ data }) => ({
  type: LOBBY_CHANGE,
  payload: data,
});

export const initializeLobbySocket = () => ({
  type: INITIALIZE_LOBBY_SOCKET,
});
export const cleanLobby = () => ({
  type: CLEAN_LOBBY,
});
