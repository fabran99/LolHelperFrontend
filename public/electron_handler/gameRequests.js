const { request } = require("league-connect");
const rp = require("request-promise");
const {
  RuneHandler,
  SummonersHandler,
  LauncherHandler,
} = require("./lcuHandler/lcuHandler");

// Runes
const parseRunePage = (runePage, pageName, makeCurrent) => {
  makeCurrent = makeCurrent || false;

  var edited = {
    primaryStyleId: runePage.primary.main,
    subStyleId: runePage.secondary.main,
    selectedPerkIds: [],
  };

  for (let i = 0; i < 4; i++) {
    edited.selectedPerkIds.push(runePage.primary[`perk${i}`]);
  }
  for (let i = 4; i < 6; i++) {
    edited.selectedPerkIds.push(runePage.secondary[`perk${i}`]);
  }

  for (let i = 0; i < 3; i++) {
    edited.selectedPerkIds.push(runePage.perks[`statPerk${i}`]);
  }

  if (makeCurrent) {
    edited.isActive = true;
  }

  edited.name = `${pageName}`;

  return edited;
};

const updateRunePage = async (event, data) => {
  var data = JSON.parse(data);
  const { runePage, champName, connection } = data;

  const handler = new RuneHandler(connection);
  var rpage = parseRunePage(runePage, champName, true);

  var updated_rune = await handler.setRunePage(rpage);
  return updated_rune;
};

// Player info
const getSummonerInfoById = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var summHandler = new SummonersHandler(connection);
  var result = await summHandler.getSummonerDataById(summonerId);
  return result;
};

const getSummonerMasteries = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var summHandler = new SummonersHandler(connection);
  var result = await summHandler.getSummonerMasteriesById(summonerId);
  return result;
};

const getBestChampsBySummoner = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var summHandler = new SummonersHandler(connection);
  var data = await summHandler.getSummonerMasteriesById(summonerId, (top = 3));
  return data;
};

const getRankedStatsByPuuid = async (event, data) => {
  const { puuid, connection } = JSON.parse(data);
  var summHandler = new SummonersHandler(connection);
  var result = await summHandler.getRankedStatsByPuuid(puuid);
  return result;
};

const getCurrentSummonerData = async (event, data) => {
  const { connection } = JSON.parse(data);

  var summHandler = new SummonersHandler(connection);
  var result = await summHandler.getCurrentSummonerData();
  return result;
};

const getSummonerDetail = async (event, data) => {
  const { connection, summoner: basicData } = JSON.parse(data);
  const { puuid, summonerId } = basicData;

  try {
    // Traigo datos de ranked
    var rankedStats = await getRankedStatsByPuuid(
      null,
      JSON.stringify({ puuid, connection })
    );

    var key = puuid || Object.keys(rankedStats)[0];
    var rankData = rankedStats[key].queueMap["RANKED_SOLO_5x5"];
    var { tier, wins, division } = rankData;
    var isInPromo = rankData.miniSeriesProgress != "";

    rankedStats = {
      tier,
      wins,
      division,
      isInPromo,
    };

    // Traigo lista de partidas
    var matchlist = await getMatchlist(
      null,
      JSON.stringify({ puuid, connection })
    );

    // Traigo lista de maestrias
    var masteries = await getSummonerMasteries(
      null,
      JSON.stringify({
        summonerId,
        connection,
      })
    );

    var summDetail = {
      ...rankedStats,
      matchlist,
      masteries,
    };
    return summDetail;
  } catch (e) {
    console.log(e);
  }
};

const getMatchlist = async (event, data) => {
  const { puuid, connection, summonerId, displayName, host } = JSON.parse(data);

  var summHandler = new SummonersHandler(connection);
  var currentRegion = await summHandler.getRegionData();
  var usedEndpoint = false;

  // Trato de pedir la lista de ids de partidas a la api del sistema, sino
  // intento usar la api del launcher
  try {
    var result = await rp({
      method: "GET",
      uri: `${host}/stats/player_matchlist/?limit=20&username=${displayName}&region=${currentRegion.region}`,
      strictSSL: false,
      resolveWithFullResponse: true,
    });
    result = JSON.parse(result.body).game_ids;
    usedEndpoint = true;
  } catch (e) {
    var result = await summHandler.getMatchlistByPuuid(puuid);
    result = result.map((x) => x.gameId);
  }

  // Tomo los primeros 20 juegos
  var games = [];
  var end = Math.min(20, result.length);
  for (let i = 0; i < end; i++) {
    let game = await summHandler.getMatchDetail(
      result[usedEndpoint ? i : result.length - i - 1]
    );
    games.push(game);
  }

  // Parseo la info
  let finalGames = games.map((game) => {
    let playerIdentity = game.participantIdentities.find(
      (participant) => participant.player.summonerId == summonerId
    );
    let playerData = game.participants.find(
      (participant) => participant.participantId == playerIdentity.participantId
    );
    let gameInfo = {
      lane: playerData.timeline.lane,
      role: playerData.timeline.role,
      championId: playerData.championId,
      gameId: game.gameId,
      timestamp: game.gameCreation,
      teamId: playerData.teamId,
      win: playerData.stats.win,
      visionScore: playerData.stats.visionScore,
      kills: playerData.stats.kills,
      csScore: playerData.stats.totalMinionsKilled,
      deaths: playerData.stats.deaths,
      assists: playerData.stats.assists,
      goldEarned: playerData.stats.goldEarned,
      gameDuration: millisToMinutesAndSeconds(game.gameDuration * 1000),
      csPerMin: (
        playerData.stats.totalMinionsKilled /
        (game.gameDuration / 60)
      ).toFixed(2),
      kd: (
        playerData.stats.kills / Math.max(playerData.stats.deaths, 1)
      ).toFixed(2),
      kda: (
        playerData.stats.kills +
        playerData.stats.assists / Math.max(playerData.stats.deaths, 1)
      ).toFixed(2),
      queueType: game.queueId,
      fullGameData: game,
    };
    return gameInfo;
  });

  return finalGames;
};

// launcher actions
const checkReadyForMatch = async (event, data) => {
  const { connection } = JSON.parse(data);
  var handler = new LauncherHandler(connection);
  var result = await handler.checkReadyForMatch();

  return result;
};

const AskLane = async (event, data) => {
  const { connection, chatRoomName, lane } = JSON.parse(data);
  var id = chatRoomName.split("@")[0];
  if (!id) {
    return null;
  }

  var handler = new LauncherHandler(connection);
  var result = await handler.writeInChat(id, lane);

  return result;
};

const restartUx = async (event, data) => {
  const { connection } = JSON.parse(data);

  var handler = new LauncherHandler(connection);
  var result = await handler.restartUx();

  return result;
};

const getCurrentGameData = async (event, data) => {
  var handler = new LauncherHandler(null);
  var result = await handler.getCurrentGameData();
  return result;
};

// Utility
const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

module.exports = {
  parseRunePage,
  updateRunePage,
  getSummonerInfoById,
  getBestChampsBySummoner,
  getRankedStatsByPuuid,
  checkReadyForMatch,
  AskLane,
  getSummonerMasteries,
  getMatchlist,
  restartUx,
  getCurrentSummonerData,
  getCurrentGameData,
  getSummonerDetail,
};
