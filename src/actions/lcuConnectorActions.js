import { LCU_CONNECT, LCU_DISCONNECT } from "./types";

export const lcuConnect = (data) => (dispatch) => {
  const { auth } = window.league_connect;
  // Guarda en redux la info para la conexion
  console.log("action");
  if (data) {
    dispatch({
      type: LCU_CONNECT,
      payload: data,
    });
    return null;
  }
  auth()
    .then((res) => {
      dispatch({
        type: LCU_CONNECT,
        payload: res,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const lcuDisconnect = () => (dispatch) => {
  // Borra la info de conexion en redux
  dispatch({
    type: LCU_DISCONNECT,
  });
};
