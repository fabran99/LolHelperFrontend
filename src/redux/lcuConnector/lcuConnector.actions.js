import { LCU_CONNECT, LCU_DISCONNECT } from "./lcuConnector.types";

export const lcuConnect = (data) => ({
  type: LCU_CONNECT,
  payload: data,
});

export const lcuDisconnect = () => ({
  type: LCU_DISCONNECT,
});
