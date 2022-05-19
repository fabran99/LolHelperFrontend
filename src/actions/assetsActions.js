import { GET_ASSETS, ERROR_GET_ASSETS } from "./types";
import { assetsUrls } from "../endpoints/assets";
import axios from "axios";
import default_assets from "../json/default_assets.json";

export const getAssets = () => (dispatch) => {
  // Solicita info de los assets
  axios
    .get(`${process.env.REACT_APP_HOST}${assetsUrls["get_assets"]}`)
    .then((res) => {
      dispatch({
        type: GET_ASSETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch({
      //   type: ERROR_GET_ASSETS,
      // });
      dispatch({
        type: GET_ASSETS,
        payload: default_assets,
      });
    });
};
