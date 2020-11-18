import { LOBBY_CHANGE } from "./lobby.types";

export const lobbyChange = ({ data }) => ({
  type: LOBBY_CHANGE,
  payload: data,
});
