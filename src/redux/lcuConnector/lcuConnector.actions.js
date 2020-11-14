import {
  LCU_CONNECT,
  LCU_DISCONNECT,
  LOBBY_CHANGE,
  CHAMPSELECT_CHANGE,
  GAMESESSION_CHANGE,
} from "./lcuConnector.types";

export const lcuConnect = (data) => (dispatch) => {
  // Guarda la info de conexion en redux
  dispatch({
    type: LCU_CONNECT,
    payload: data,
  });
};

export const lcuDisconnect = () => (dispatch) => {
  // Borra la info de conexion en redux
  dispatch({
    type: LCU_DISCONNECT,
  });
};

export const champselectchange = (data) => (dispatch) => {
  // Borra la info de conexion en redux
  dispatch({
    type: CHAMPSELECT_CHANGE,
    payload: data,
  });
};
export const gamesessionChange = (data) => (dispatch) => {
  // Borra la info de conexion en redux
  dispatch({
    type: GAMESESSION_CHANGE,
    payload: data,
  });
};

export const lobbyChange = (data) => (dispatch) => {
  // Borra la info de conexion en redux
  dispatch({
    type: LOBBY_CHANGE,
    payload: data,
  });
};
