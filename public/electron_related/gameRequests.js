const { request } = require("league-connect");
const rp = require("request-promise");


// Runes
const parseRunepage = (runepage, champName, make_current) => {
  make_current = make_current || false;

  var edited = {
    primaryStyleId: runepage.primary.main,
    subStyleId: runepage.secondary.main,
    selectedPerkIds: [],
  };

  for (let i = 0; i < 4; i++) {
    edited.selectedPerkIds.push(runepage.primary[`perk${i}`]);
  }
  for (let i = 4; i < 6; i++) {
    edited.selectedPerkIds.push(runepage.secondary[`perk${i}`]);
  }

  for (let i = 0; i < 3; i++) {
    edited.selectedPerkIds.push(runepage.perks[`statPerk${i}`]);
  }

  if (make_current) {
    edited.isActive = true;
  }

  edited.name = `${champName}`;

  return edited;
};

const updateRunePage = async (event, data) => {
  var data = JSON.parse(data);
  const { runePage, champName, connection } = data;

  var rpage = parseRunepage(runePage, champName, true);

  var pageList = await request(
    {
      url: "/lol-perks/v1/pages",
      method: "GET",
    },
    connection
  );

  pageList = await pageList.json();
  var editable = pageList.filter((item) => {
    return item.isEditable;
  });

  if (!editable.length) {
    var postPage = await request(
      {
        url: `/lol-perks/v1/pages`,
        method: "POST",
        body: rpage,
      },
      connection
    );

    postPage = await postPage.json();

    return postPage;
  } else {
    // Busco una runa con el nombre del champ
    var editable_and_active = editable.find((x) => x.name == champName);
    if (!editable_and_active) {
      // Reviso si alguna de las editables esta activa
      editable_and_active = editable.find((x) => x.isActive);
    }
    var to_edit = editable_and_active ? editable_and_active : editable[0];

    to_edit = { ...rpage, id: to_edit.id };
    // Mando a actualizar
    var deletePage = await request(
      {
        url: `/lol-perks/v1/pages/${to_edit.id}`,
        method: "DELETE",
        body: to_edit,
      },
      connection
    );

    var postPage = await request(
      {
        url: `/lol-perks/v1/pages`,
        method: "POST",
        body: to_edit,
      },
      connection
    );

    postPage = await postPage.json();

    return postPage;
  }
};


// Player info
const getSummonerInfoById = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-summoner/v1/summoners/${summonerId}`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getSummonerMasteries = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);

  var result = await request(
    {
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getBestChampsBySummoner = async (event, data) => {
  const { summonerId, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=3`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const getRankedStatsByPuuid = async (event, data) => {
  const { puuid, connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-ranked/v1/ranked-stats?puuids=["${puuid}"]`,
      method: "GET",
      json: true,
    },
    connection
  );

  var parsedResult = await result.json();
  return parsedResult;
};

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};


const getMatchDetail = async (connection, gameId) =>{
  var result = await request(
    {
      url: `/lol-match-history/v1/games/${gameId}`,
      method: "GET",
      json: true,
    },
    connection
  );

  return result;
}

const getRegion = async (connection) => {
  var result = await request(
    {
      url: `/riotclient/get_region_locale`,
      method: "GET",
      json: true,
    },
    connection
  );

  return result;
}


const getMatchlist = async (event, data) => {
  const { puuid, connection, summonerId, displayName, host } = JSON.parse(data);
  let currentRegion = await getRegion(connection);
  currentRegion = await currentRegion.json();
  // let result = await request(
  //   {
  //     url: `/lol-career-stats/v1/summoner-games/${puuid}`,
  //     method: "GET",
  //     json: true,
  //   },
  //   connection
  // );
  let endpoint = false;
  try{
    var result = await rp({
      method:"GET",
      uri:`${host}/stats/player_matchlist/?limit=20&username=${displayName}&region=${currentRegion.region}`,
      strictSSL: false,
      resolveWithFullResponse: true,
    })
    result = JSON.parse(result.body).game_ids
    console.log(result)
    endpoint = true
  }
  catch(e){
    console.log(e)
     var result = await request(
    {
      url: `/lol-career-stats/v1/summoner-games/${puuid}`,
      method: "GET",
      json: true,
    },
    connection
  );
  result = await result.json()
  result = result.map(x => x.gameId)
  }

  var games = [];
  var end = Math.min(20, result.length);
  for(let i = 0; i< end; i++){
    let game = await getMatchDetail(connection, result[endpoint? i : result.length - i - 1]);
    games.push(await game.json());
  }

  let finalGames = games.map(game =>{
    let playerIdentity = game.participantIdentities.find(participant=>participant.player.summonerId == summonerId);
    let playerData = game.participants.find(participant => participant.participantId == playerIdentity.participantId);
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
      gameDuration: millisToMinutesAndSeconds(game.gameDuration*1000),
      csPerMin: (playerData.stats.totalMinionsKilled/(
        game.gameDuration/60
      )).toFixed(2),
      kd: (playerData.stats.kills/Math.max(playerData.stats.deaths, 1)).toFixed(2),
      kda: (playerData.stats.kills+playerData.stats.assists/Math.max(playerData.stats.deaths, 1)).toFixed(2),
      queueType: game.queueId,
      fullGameData:game
    }
    return gameInfo
  })


  // for (let i = 0; i < end; i++) {
  //   let current_game = parsedResult[parsedResult.length - i - 1];
  //   let current_stats = current_game.stats["CareerStats.js"];
  //   console.log(current_game.gameId)
  //   let game = {
  //     lane: current_game.lane,
  //     queueType: current_game.queueId,
  //     role: current_game.role,
  //     championId: current_game.championId,
  //     gameId: current_game.gameId,
  //     timestamp: current_game.timestamp,
  //     teamId: current_game.teamId,
  //     win: current_stats.victory == 1,
  //     visionScore: current_stats.visionScore,
  //     kills: current_stats.kills,
  //     csScore: current_stats.csScore,
  //     deaths: current_stats.deaths,
  //     assists: current_stats.assists,
  //     goldEarned: current_stats.goldEarned,
  //     gameDuration: millisToMinutesAndSeconds(current_stats.timePlayed),
  //     csPerMin: (
  //       current_stats.csScore /
  //       (current_stats.timePlayed / 1000 / 60)
  //     ).toFixed(2),
  //     kd: parseFloat(
  //       (current_stats.kills / Math.max(1, current_stats.deaths)).toFixed(2)
  //     ),
  //     kda: parseFloat(
  //       (
  //         (current_stats.kills + current_stats.assists) /
  //         Math.max(1, current_stats.deaths)
  //       ).toFixed(2)
  //     ),
  //   };
  //   games.push(game);
  // }

  return finalGames;
};

// launcher actions
const checkReadyForMatch = async (event, data) => {
  const { connection } = JSON.parse(data);
  var result = await request(
    {
      url: `/lol-matchmaking/v1/ready-check/accept`,
      method: "POST",
      json: true,
    },
    connection
  );

  return result;
};

const AskLane = async (event, data) => {
  const { connection, chatRoomName, lane } = JSON.parse(data);
  var id = chatRoomName.split("@")[0];
  if (!id) {
    return null;
  }
  var result = await request(
    {
      url: `/lol-chat/v1/conversations/${id}/messages`,
      method: "POST",
      json: true,
      body: {
        body: lane,
      },
    },
    connection
  );

  result = await result.json();
  return result;
};

const restartUx = async (event, data) => {
  const { connection } = JSON.parse(data);

  var result = await request(
    {
      url: `/riotclient/kill-and-restart-ux`,
      method: "POST",
      json: true,
    },
    connection
  );

  result = await result;
  return result;
};

const getCurrentSummonerData = async (event, data) => {
  const { connection } = JSON.parse(data);

  var result = await request(
    {
      url: `/lol-summoner/v1/current-summoner`,
      method: "GET",
      json: true,
    },
    connection
  );

  result = await result.json();

  return result;
};

const getCurrentGameData = async (event, data) => {
  var options = {
    method: "GET",
    uri: `https://127.0.0.1:2999/liveclientdata/allgamedata`,
    resolveWithFullResponse: true,
    strictSSL: false,
  };

  var result = await rp(options);
  return result.body;
};

module.exports = {
  parseRunepage,
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
