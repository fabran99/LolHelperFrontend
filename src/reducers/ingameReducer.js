import {
  UPDATE_GAMEINFO,
  UPDATE_ADVISE,
  UPDATE_TIMER,
  UPDATE_LAST_EVENT,
  UPDATE_EVENTS_NOTIFIED,
  CLEAN_INGAME_REDUCER,
  UPDATE_INGAME_STATE,
} from "../actions/types";

var initialState = {
  isInGame: false,
  gameInfo: {
    gameData: null,
    activePlayer: null,
    allPlayers: null,
    events: null,
  },
  advises: {
    tooMuchGold: {
      timestamp: null,
      done: false,
      value: null,
    },
    enemyFeed: {
      timestmap: null,
      done: false,
      value: null,
    },
  },
  timers: {
    cannonWave: {
      timestamp: null,
      done: false,
    },
    dragonSpawn: {
      timestamp: null,
      done: false,
      nextSpawn: null,
    },
    herald: {
      timestamp: null,
      done: false,
      nextSpawn: null,
    },
    enemySpawns: [],
  },
  eventsNotified: 0,
  lastEvent: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CLEAN_INGAME_REDUCER:
      return initialState;
    case UPDATE_ADVISE:
      return {
        ...state,
        advises: {
          ...state.advises,
          ...action.payload,
        },
      };
    case UPDATE_LAST_EVENT:
      return { ...state, lastEvent: action.payload };
    case UPDATE_EVENTS_NOTIFIED:
      return { ...state, eventsNotified: action.payload };
    case UPDATE_INGAME_STATE:
      return { ...state, isInGame: action.payload };
    case UPDATE_TIMER:
      return {
        ...state,
        timers: {
          ...state.timers,
          ...action.payload,
        },
      };
    case UPDATE_GAMEINFO:
      return {
        ...state,
        gameInfo: {
          ...state.gameInfo,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
