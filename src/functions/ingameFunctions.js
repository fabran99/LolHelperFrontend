import { secondsToTime } from "../helpers/general";

const INGAME_TEAM_NAMES = {
  teamOne: "ORDER",
  teamTwo: "CHAOS",
};

export const getTeams = (gameSession, summoner, ingame, assets) => {
  if (
    !summoner ||
    !summoner.summonerId ||
    !gameSession ||
    !gameSession.gameData
  ) {
    return { team1: [], team2: [], localTeam: "teamOne" };
  }
  var { summonerId } = summoner;
  var { gameData } = gameSession;
  var localTeam = "teamOne";
  var teamOne = [];
  var teamTwo = [];

  //   Team 1
  gameData.teamOne.forEach((tmember, i) => {
    var localPlayer = tmember.summonerId == summonerId;
    if (localPlayer) {
      localTeam = "teamOne";
    }

    var memberData = {
      accountId: tmember.accountId,
      summonerId: tmember.summonerId,
      profileIconId: tmember.profileIconId,
      puuid: tmember.puuid,
      displayName: tmember.summonerName,
      localPlayer,
      summonerInternalName: tmember.summonerInternalName,
      team: "teamOne",
    };
    var isBot = "botSkillLevel" in tmember;

    if (isBot) {
      memberData.isBot = tmember.botSkillLevel;
    }

    var selection = gameData.playerChampionSelections.find(
      (el) => el.summonerInternalName == tmember.summonerInternalName
    );

    if (isBot) {
      var champ = null;
      var name = memberData.displayName;
      if (!selection) {
        champ = assets.champions.find((el) => el.name == name.split(" bot")[0]);
      } else {
        champ = assets.champions.find(
          (el) => el.championId == selection.championId
        );
      }
      if (champ) {
        name = `Bot ${champ.name}`;
      }
      memberData.displayName = name;
    }

    if (selection) {
      memberData.championId = selection.championId;
      memberData.spell1Id = selection.spell1Id;
      memberData.spell2Id = selection.spell2Id;
      memberData.selectedSkinIndex = selection.selectedSkinIndex;
    } else {
      if (ingame.allPlayers) {
        var currentPlayerData = ingame.allPlayers.find(
          (el) => el.summonerName == memberData.displayName
        );

        if (currentPlayerData) {
          memberData.selectedSkinIndex = currentPlayerData.skinID;
          var champion = assets.champions.find(
            (el) => el.name == currentPlayerData.championName
          );

          if (champion) {
            memberData.championId = champion.championId;
          }
          var spell1 = assets.spells.find(
            (el) =>
              el.name ==
              currentPlayerData.summonerSpells.summonerSpellOne.displayName
          );
          var spell2 = assets.spells.find(
            (el) =>
              el.name ==
              currentPlayerData.summonerSpells.summonerSpellTwo.displayName
          );

          if (spell1) {
            memberData.spell1Id = spell1.key;
          }
          if (spell2) {
            memberData.spell2Id = spell2.key;
          }
        } else {
          memberData = {
            ...memberData,
            championId: null,
            spell1Id: null,
            spell2Id: null,
            selectedSkinIndex: null,
          };
        }
      } else {
        memberData = {
          ...memberData,
          championId: null,
          spell1Id: null,
          spell2Id: null,
          selectedSkinIndex: null,
        };
      }
    }

    if (ingame && ingame.allPlayers) {
      var generalData = ingame.allPlayers.find(
        (el) =>
          el.summonerName == memberData.displayName &&
          el.team == INGAME_TEAM_NAMES[memberData.team]
      );
      if (generalData) {
        memberData = {
          ...memberData,
          ...generalData,
        };
      }
    }
    teamOne.push(memberData);
  });

  //   Team 2
  gameData.teamTwo.forEach((tmember, i) => {
    var localPlayer = tmember.summonerId == summonerId;
    if (localPlayer) {
      localTeam = "teamTwo";
    }
    var memberData = {
      accountId: tmember.accountId,
      summonerId: tmember.summonerId,
      profileIconId: tmember.profileIconId,
      puuid: tmember.puuid,
      displayName: tmember.summonerName,
      localPlayer,
      summonerInternalName: tmember.summonerInternalName,
      team: "teamTwo",
    };

    var isBot = "botSkillLevel" in tmember;

    if (isBot) {
      memberData.isBot = tmember.botSkillLevel;
    }

    var selection = gameData.playerChampionSelections.find(
      (el) => el.summonerInternalName == tmember.summonerInternalName
    );

    if (isBot) {
      var champ = null;
      var name = memberData.displayName;
      if (!selection) {
        var champName = name.split(" bot")[0];
        champ = assets.champions.find(
          (el) => el.name == champName || el.key == champName
        );
      } else {
        champ = assets.champions.find(
          (el) => el.championId == selection.championId
        );
      }
      if (champ) {
        name = `Bot ${champ.name}`;
      }
      memberData.displayName = name;
    }

    if (selection) {
      memberData.championId = selection.championId;
      memberData.spell1Id = selection.spell1Id;
      memberData.spell2Id = selection.spell2Id;
      memberData.selectedSkinIndex = selection.selectedSkinIndex;
    } else {
      if (ingame.allPlayers) {
        var currentPlayerData = ingame.allPlayers.find(
          (el) =>
            el.summonerName == memberData.displayName &&
            el.team == INGAME_TEAM_NAMES[memberData.team]
        );
        if (currentPlayerData) {
          memberData.selectedSkinIndex = currentPlayerData.skinID;
          var champion = assets.champions.find(
            (el) => el.name == currentPlayerData.championName
          );

          if (champion) {
            memberData.championId = champion.championId;
          }
          var spell1 = assets.spells.find(
            (el) =>
              el.name ==
              currentPlayerData.summonerSpells.summonerSpellOne.displayName
          );
          var spell2 = assets.spells.find(
            (el) =>
              el.name ==
              currentPlayerData.summonerSpells.summonerSpellTwo.displayName
          );

          if (spell1) {
            memberData.spell1Id = spell1.key;
          }
          if (spell2) {
            memberData.spell2Id = spell2.key;
          }
        } else {
          memberData = {
            ...memberData,
            championId: null,
            spell1Id: null,
            spell2Id: null,
            selectedSkinIndex: null,
          };
        }
      } else {
        memberData = {
          ...memberData,
          championId: null,
          spell1Id: null,
          spell2Id: null,
          selectedSkinIndex: null,
        };
      }
    }

    if (ingame && ingame.allPlayers) {
      var generalData = ingame.allPlayers.find(
        (el) =>
          el.summonerName == memberData.displayName &&
          el.team == INGAME_TEAM_NAMES[memberData.team]
      );
      if (generalData) {
        memberData = {
          ...memberData,
          ...generalData,
        };
      }
    }
    teamTwo.push(memberData);
  });

  return { teamOne, teamTwo, localTeam };
};

export const getSummonerChamp = (gameSession, summoner) => {
  if (
    !summoner ||
    !summoner.summonerId ||
    !gameSession ||
    !gameSession.gameData
  ) {
    return null;
  }

  var { summonerId } = summoner;
  var { gameData } = gameSession;
  var teams = [...gameData.teamOne, ...gameData.teamTwo];

  for (let i = 0; i < teams.length; i++) {
    var current_el = teams[i];
    if (current_el.summonerId == summonerId) {
      var selection = gameData.playerChampionSelections.find(
        (el) => el.summonerInternalName == current_el.summonerInternalName
      );

      if (selection) {
        return selection.championId;
      }
    }
  }

  return null;
};

export const getTeamStats = (team, enemyTeam, ingame, teamId, assets) => {
  var teamNames = team.map((item) => item.displayName);
  var enemyNames = enemyTeam.map((item) => item.displayName);

  var dragonKills = [];
  var heraldKills = [];
  var turretKills = [];
  var baronKills = [];
  var teamKills = 0;
  var enemyKills = 0;
  var teamGold = 0;

  // Scores y oro
  team.forEach((tmember) => {
    if (tmember && tmember.scores && tmember.scores.kills) {
      teamKills += tmember.scores.kills;
    }

    if (tmember && tmember.items) {
      tmember.items.forEach((item) => {
        var itemPrice = assets.items.find((el) => el.id == item.itemID);
        if (itemPrice) {
          teamGold += itemPrice.price * item.count;
        }
      });
    }
  });
  enemyTeam.forEach((tmember) => {
    if (tmember && tmember.scores && tmember.scores.kills) {
      enemyKills += tmember.scores.kills;
    }
  });

  // Eventos
  var otherTeam = teamId == "teamOne" ? "T2" : "T1";

  if (ingame && ingame.events && ingame.events.Events) {
    ingame.events.Events.forEach((event) => {
      // Dragones
      if (event.EventName == "DragonKill") {
        if (
          teamNames.indexOf(event.KillerName) != -1 &&
          event.DragonType != "Elder"
        ) {
          dragonKills.push({
            EventTime: event.EventTime,
            DragonType: event.DragonType,
            KillerName: event.KillerName,
            EventID: event.EventID,
          });
        }
      } else if (event.EventName == "TurretKilled") {
        // Torretas
        if (event.TurretKilled.indexOf(`Turret_${otherTeam}`) != -1) {
          turretKills.push({
            EventTime: event.EventTime,
            KillerName: event.KillerName,
            EventID: event.EventID,
          });
        }
      } else if (event.EventName == "HeraldKill") {
        // Heraldos
        if (teamNames.indexOf(event.KillerName) != -1) {
          heraldKills.push({
            EventTime: event.EventTime,
            KillerName: event.KillerName,
            EventID: event.EventID,
          });
        }
      } else if (event.EventName == "BaronKill") {
        if (teamNames.indexOf(event.KillerName) != -1) {
          baronKills.push({
            EventTime: event.EventTime,
            KillerName: event.KillerName,
            EventID: event.EventID,
          });
        }
      }
    });
  }

  return {
    dragonKills,
    heraldKills,
    baronKills,
    turretKills,
    teamKills,
    enemyKills,
    teamGold,
  };
};

// Drake spawn
export const minsToSeconds = (min, secs) => {
  return Math.round(min * 60 + secs);
};

const FIRST_DRAKE_SPAWN = minsToSeconds(5, 0);
const NORMAL_DRAKE_RESPAWN_TIME = minsToSeconds(5, 0);
const ELDER_DRAKE_RESPAWN_TIME = minsToSeconds(6, 0);

export const getNextDrakeTime = (ingame, allyDrakeKills, enemyDrakeKills) => {
  var events = [];

  if (ingame && ingame.events && ingame.events.Events) {
    events = ingame.events.Events.reverse();
  } else {
    return false;
  }
  var timer = null;
  if (ingame && ingame.gameData && ingame.gameData.gameTime) {
    timer = Math.round(ingame.gameData.gameTime);
  } else {
    return false;
  }

  // Si estoy antes del primer spawn entonces devuelvo lo que falta
  if (timer <= FIRST_DRAKE_SPAWN) {
    return {
      timeLeft: secondsToTime(FIRST_DRAKE_SPAWN - timer),
      isElder: false,
    };
  }

  // Si estoy luego del primer spawn reviso si hubo un asesinato de dragon
  var lastDrakeKill = events.find((el) => el.EventName == "DragonKill");

  // Si no lo mataron sigue vivo el inicial
  if (!lastDrakeKill) {
    return {
      timeLeft: null,
      isElder: false,
    };
  }

  // Si mataron a alguno reviso el tipo, si es elder el siguiente es elder,
  // Si algun team mata a 4 entonces tambien es elder
  if (
    lastDrakeKill.DragonType == "Elder" ||
    allyDrakeKills == 4 ||
    enemyDrakeKills == 4
  ) {
    let timeLeft =
      ELDER_DRAKE_RESPAWN_TIME - Math.round(timer - lastDrakeKill.EventTime);

    return {
      timeLeft: timeLeft <= 0 ? null : secondsToTime(timeLeft),
      isElder: true,
    };
  }
  // Si no es elder, significa que es normal
  let timeLeft =
    NORMAL_DRAKE_RESPAWN_TIME - Math.round(timer - lastDrakeKill.EventTime);
  return {
    timeLeft: timeLeft <= 0 ? null : secondsToTime(timeLeft),
    isElder: false,
  };
};

// Cannon wave
const FIRST_CANNONWAVE_SPAWN = minsToSeconds(2, 5);
const CANNONWAVE_RESPAWN_TIMES = [
  {
    after: FIRST_CANNONWAVE_SPAWN,
    before: minsToSeconds(20, 0),
    respawn: minsToSeconds(1, 30),
  },
  {
    after: minsToSeconds(20, 0),
    before: minsToSeconds(35, 0),
    respawn: minsToSeconds(1, 0),
  },
  {
    after: minsToSeconds(35, 0),
    before: minsToSeconds(1000, 0),
    respawn: minsToSeconds(0, 30),
  },
];

export const getNextCannonwaveTime = (ingame) => {
  var timer = null;
  if (ingame && ingame.gameData && ingame.gameData.gameTime) {
    timer = Math.round(ingame.gameData.gameTime);
  } else {
    console.log(1);
    return null;
  }

  // Si es antes de la primera wave
  if (timer < FIRST_CANNONWAVE_SPAWN) {
    console.log(2);
    return secondsToTime(FIRST_CANNONWAVE_SPAWN - timer);
  }

  // Rango a rango reviso si esta por debajo
  for (let i = 0; i < CANNONWAVE_RESPAWN_TIMES.length; i++) {
    let currentTime = CANNONWAVE_RESPAWN_TIMES[i];
    if (timer <= currentTime.before) {
      let currentValue = currentTime.after;
      while (currentValue < currentTime.before && currentValue <= timer) {
        currentValue += currentTime.respawn;
      }
      console.log(3);
      return secondsToTime(currentValue - timer);
    }
  }

  console.log(4);
  return null;
};

// Baron

const FIRST_BARON_SPAWN = minsToSeconds(20, 0);
const BARON_RESPAWN_TIME = minsToSeconds(6, 0);

export const getNextBaronTime = (ingame) => {
  var events = [];

  if (ingame && ingame.events && ingame.events.Events) {
    events = ingame.events.Events.reverse();
  } else {
    console.log(ingame);
    return false;
  }
  var timer = null;
  if (ingame && ingame.gameData && ingame.gameData.gameTime) {
    timer = Math.round(ingame.gameData.gameTime);
  } else {
    return false;
  }

  // Si estoy antes del primer spawn entonces devuelvo lo que falta
  if (timer <= FIRST_BARON_SPAWN) {
    return secondsToTime(FIRST_BARON_SPAWN - timer);
  }

  // Si estoy luego del primer spawn reviso si hubo un asesinato de baron
  var lastBaronKill = events.find((el) => el.EventName == "BaronKill");

  // Si no lo mataron sigue vivo el inicial
  if (!lastBaronKill) {
    return null;
  }

  let timeLeft =
    BARON_RESPAWN_TIME - Math.round(timer - lastBaronKill.EventTime);
  return timeLeft <= 0 ? null : secondsToTime(timeLeft);
};
