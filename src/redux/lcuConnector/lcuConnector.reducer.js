import {
  LCU_CONNECT,
  LCU_DISCONNECT,
  CHAMPSELECT_CHANGE,
  GAMESESSION_CHANGE,
  LOBBY_CHANGE,
} from "./lcuConnector.types";

const initialState = {
  connected: false,
  connection: null,
  champSelect: null,
  gameSession: {
    phase: "None",
  },
  lobby: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LCU_CONNECT:
      return {
        ...state,
        connection: {
          ...action.payload,
        },
        connected: true,
      };
    case LCU_DISCONNECT:
      return initialState;

    case CHAMPSELECT_CHANGE:
      return {
        ...state,
        champSelect: action.payload.data,
      };
    case GAMESESSION_CHANGE:
      return {
        ...state,
        gameSession: action.payload.data,
      };
    case LOBBY_CHANGE:
      return {
        ...state,
        lobby: action.payload.data,
      };
    default:
      return state;
  }
};
