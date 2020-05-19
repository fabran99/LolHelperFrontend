import {
  LCU_CONNECT,
  LCU_DISCONNECT,
  LCU_NOT_LAUNCHED,
} from "../actions/types";

const initialState = {
  connection: {
    name: null,
    password: null,
    pid: null,
    port: null,
    protocol: null,
  },
  connected: false,
  not_launched: false,
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
        not_launched: false,
      };
    case LCU_DISCONNECT:
      return {
        ...state,
        connection: {
          name: null,
          password: null,
          pid: null,
          protocol: null,
          port: null,
        },
        connected: false,
        not_launched: false,
      };
    default:
      return state;
  }
};
