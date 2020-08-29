import { UPDATE_GAMEINFO } from "../actions/types";

var initialState = {
  isInGame: false,
  activePlayer: null,
  allPlayers: null,
  events: null,
  gameData: null,
  lastEvent: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GAMEINFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
