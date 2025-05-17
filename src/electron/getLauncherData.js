import { electron } from "../helpers/outsideObjects";

// Summoner data
export const getSummonerData = async (connection, retries = 0) => {
  try {
    var response = await electron.ipcRenderer.invoke(
      "GET_CURRENT_SUMMONER_DATA",
      JSON.stringify({ connection })
    );
  } catch (e) {
    // Wait 5 seconds and try again
    if (retries > 5) {
      return { error: "Error getting summoner data" };
    }
    console.log("Retrying to get summoner data", retries);
    await new Promise((resolve) => setTimeout(resolve, 5000 * (retries + 1)));
    response = await getSummonerData(connection, retries + 1);
  }

  if (response == null) {
    if (retries > 5) {
      return { error: "Error getting summoner data" };
    }
    console.log("Retrying to get summoner data", retries);
    await new Promise((resolve) => setTimeout(resolve, 5000 * (retries + 1)));
    response = await getSummonerData(connection, retries + 1);
  }

  return response;
};

export const getSummonerInfoByID = async (connection, summonerId) => {
  var response = await electron.ipcRenderer.invoke(
    "GET_SUMMONER_INFO_BY_ID",
    JSON.stringify({ connection, summonerId })
  );

  return response;
};
export const getSummonerInfoByName = async (connection, summonerName) => {
  var response = await electron.ipcRenderer.invoke(
    "GET_SUMMONER_INFO_BY_NAME",
    JSON.stringify({ connection, summonerName })
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

// Llamadas asincronas

export const changeCurrentRunes = async (connection, champName, runePage) => {
  return electron.ipcRenderer.invoke(
    "CHANGE_RUNES",
    JSON.stringify({
      runePage,
      champName,
      connection,
    })
  );
};

export const importItemsToGame = async (build) => {
  return electron.ipcRenderer.invoke("IMPORT_ITEMS", JSON.stringify(build));
};

export const asyncGetSummonerInfoByID = async (connection, summonerId) => {
  return electron.ipcRenderer.invoke(
    "GET_SUMMONER_INFO_BY_ID",
    JSON.stringify({ connection, summonerId })
  );
};
export const asyncGetSummonerInfoByName = async (connection, summonerName) => {
  return electron.ipcRenderer.invoke(
    "GET_SUMMONER_INFO_BY_NAME",
    JSON.stringify({ connection, summonerName })
  );
};

export const getBestChampsBySummonerId = async (connection, summonerId) => {
  return electron.ipcRenderer.invoke(
    "GET_BEST_CHAMPS_BY_ID",
    JSON.stringify({ connection, summonerId })
  );
};
export const getSummonerMasteriesById = async (connection, summonerId) => {
  return electron.ipcRenderer.invoke(
    "GET_SUMMONER_MASTERIES_BY_ID",
    JSON.stringify({ connection, summonerId })
  );
};

export const getPlayerRankedData = async (connection, puuid) => {
  return electron.ipcRenderer.invoke(
    "GET_RANKED_STATS_BY_PUUID",
    JSON.stringify({ connection, puuid })
  );
};

export const getMatchlistByPuuid = async (
  connection,
  puuid,
  summonerId,
  displayName
) => {
  return electron.ipcRenderer.invoke(
    "GET_MATCHLIST_BY_PUUID",
    JSON.stringify({
      connection,
      puuid,
      summonerId,
      displayName,
      host: process.env.REACT_APP_HOST,
      apiKey: process.env.REACT_APP_API_KEY,
    })
  );
};
