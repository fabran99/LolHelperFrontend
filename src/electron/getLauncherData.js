import { electron } from "../helpers/outsideObjects";

// Summoner data
export const getSummonerData = async (connection) => {
  var response = await electron.ipcRenderer.invoke(
    "GET_CURRENT_SUMMONER_DATA",
    JSON.stringify({ connection })
  );

  return response;
};

export const getSummonerInfoByID = async (connection, summonerId) => {
  var response = await electron.ipcRenderer.invoke(
    "GET_SUMMONER_INFO_BY_ID",
    JSON.stringify({ connection, summonerId })
  );

  return response;
};

export const getSummonerDetail = async (connection, summoner) => {
  try {
    var res = await electron.ipcRenderer.invoke(
      "GET_SUMMONER_DETAIL",
      JSON.stringify({ connection, summoner })
    );

    return res;
  } catch (e) {
    console.log(e);
    return {};
  }
};
