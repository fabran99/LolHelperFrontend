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

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};

const getMatchlist = async (event, data) => {
  const { puuid, connection } = JSON.parse(data);

  var summHandler = new SummonersHandler(connection);
  var parsedResult = await summHandler.getMatchlistByPuuid(puuid);

  var games = [];
  var end = Math.min(50, parsedResult.length);
  for (let i = 0; i < end; i++) {
    let current_game = parsedResult[parsedResult.length - i - 1];
    let current_stats = current_game.stats["CareerStats.js"];

    let game = {
      lane: current_game.lane,
      queueType: current_game.queueType,
      role: current_game.role,
      championId: current_game.championId,
      gameId: current_game.gameId,
      timestamp: current_game.timestamp,
      teamId: current_game.teamId,
      win: current_stats.victory == 1,
      visionScore: current_stats.visionScore,
      kills: current_stats.kills,
      csScore: current_stats.csScore,
      deaths: current_stats.deaths,
      assists: current_stats.assists,
      goldEarned: current_stats.goldEarned,
      gameDuration: millisToMinutesAndSeconds(current_stats.timePlayed),
      csPerMin: (
        current_stats.csScore /
        (current_stats.timePlayed / 1000 / 60)
      ).toFixed(2),
      kd: parseFloat(
        (current_stats.kills / Math.max(1, current_stats.deaths)).toFixed(2)
      ),
      kda: parseFloat(
        (
          (current_stats.kills + current_stats.assists) /
          Math.max(1, current_stats.deaths)
        ).toFixed(2)
      ),
    };
    games.push(game);
  }

  return games;
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
  var handler = new LauncherHandler(connection);
  var result = await handler.getCurrentGameData();
  return result;
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
};
