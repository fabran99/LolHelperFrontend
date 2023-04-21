import { UPDATE_SUMMONER, CLEAN_SUMMONER } from "./summoner.types";
import {
  getSummonerData,
  getSummonerDetail,
} from "../../electron/getLauncherData";

export const updateSummoner = (connection, retrys) => async (dispatch) => {
  // Pido datos del summoner
  try {
    var response = await getSummonerData(connection);
  } catch (e) {
    console.log(e);
    setTimeout(() => {
      if (retrys < 15) {
        dispatch(updateSummoner(connection, retrys + 1));
      }
    }, 3000);
    return;
  }

  // Si falla hago un retry
  if (response.errorCode) {
    setTimeout(() => {
      if (retrys < 5) {
        dispatch(updateSummoner(connection, retrys + 1));
      }
    }, 3000);
  } else {
    var summData = {
      summonerId: response.summonerId,
      summonerLevel: response.summonerLevel,
      accountId: response.accountId,
      displayName: response.displayName,
      profileIconId: response.profileIconId,
      puuid: response.puuid,
    };

    try {
      var detail = await getSummonerDetail(connection, summData);
    } catch (e) {
      setTimeout(() => {
        if (retrys < 15) {
          dispatch(updateSummoner(connection, retrys + 1));
        }
      }, 3000);
      return;
    }

    summData = { ...summData, ...detail };

    dispatch({
      payload: summData,
      type: UPDATE_SUMMONER,
    });
  }
};

export const cleanSummoner = () => (dispatch) => {
  dispatch({
    type: CLEAN_SUMMONER,
  });
};
