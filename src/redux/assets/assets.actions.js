import {
  GET_ASSETS,
  ERROR_GET_ASSETS,
  INITIALIZE_GET_ASSETS,
  STOP_GETTING_ASSETS,
} from "./assets.types";

// export const getAssets = () => (dispatch) => {
//   // Solicita info de los assets
//   axios
//     .get(`${process.env.REACT_APP_HOST}${assetsUrls["get_assets"]}`)
//     .then((res) => {
//       dispatch({
//         type: GET_ASSETS,
//         payload: res.data,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       dispatch({
//         type: ERROR_GET_ASSETS,
//       });
//     });
// };

export const getAssets = (data) => ({
  type: GET_ASSETS,
  payload: data,
});

export const errorGetAssets = () => ({
  type: ERROR_GET_ASSETS,
});

export const initializeGetAssets = () => ({
  type: INITIALIZE_GET_ASSETS,
});

export const stopGettingAssets = () => ({
  type: STOP_GETTING_ASSETS,
});
