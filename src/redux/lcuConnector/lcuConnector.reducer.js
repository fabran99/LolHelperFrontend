import { LCU_CONNECT, LCU_DISCONNECT } from "./lcuConnector.types";

const initialState = {
  connected: false,
  connection: null,
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
    default:
      return state;
  }
};
