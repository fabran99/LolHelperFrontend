import moment from "moment";

export const numberToDots = (number) => {
  return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
};

export const damageDistToPercentage = (dist) => {
  var total = dist[0] + dist[1];
  return [
    parseFloat(((dist[0] * 100) / total).toFixed(2)),
    parseFloat(((dist[1] * 100) / total).toFixed(2)),
  ];
};

export const getWinrate = (champ, lane = "") => {
  var winrate = 0;
  // Armo el winrate dependiendo de si pedi una linea especifica o cualquiera
  if (!lane) {
    var lanePercents = champ.info_by_lane.map(
      (laneinfo) => laneinfo.lane_percent / 100
    );
    lanePercents.forEach((percent, i) => {
      winrate += percent * champ.winRate[i].winRate;
    });
    winrate = parseFloat(winrate.toFixed(2));
  } else {
    winrate = champ.winRate.find(
      (el) => el.lane.toLowerCase() == lane.toLowerCase()
    );
    if (winrate) {
      winrate = winrate.winRate;
    } else {
      winrate = champ.winRate[0].winRate;
    }
  }

  return winrate;
};

export const getLaneFromRole = (role, lane) => {
  if (lane == "TOP") {
    return "Top";
  } else if (lane == "MIDDLE") {
    if (role == "SUPPORT") {
      return "Support";
    }
    return "Mid";
  } else if (lane == "JUNGLE") {
    return "Jungla";
  } else if (lane == "BOTTOM") {
    if (role == "CARRY" || role == "SOLO") {
      return "ADC";
    } else {
      return "Support";
    }
  } else if (lane == "NONE") {
    if (role == "SUPPORT") {
      return "Support";
    } else if (role == "CARRY") {
      return "ADC";
    }
  }

  return "Jungla";
};

export const getStatsFromMatchlist = (matchlist, all = false) => {
  if (!matchlist || matchlist.length < 2) {
    return null;
  }

  // Detecto campeones y lineas mas jugados
  var playedLanes = {};
  var playedChamps = {};

  matchlist.forEach((match) => {
    var lane = getLaneFromRole(match.role, match.lane);
    var champ = match.championId;

    if (!(lane in playedLanes)) {
      playedLanes[lane] = {
        timesPlayed: 1,
        wins: 0,
      };
    } else {
      playedLanes[lane].timesPlayed += 1;
    }

    if (!(champ in playedChamps)) {
      playedChamps[champ] = {
        timesPlayed: 1,
        wins: 0,
        championId: champ,
      };
    } else {
      playedChamps[champ].timesPlayed += 1;
    }

    if (match.win) {
      playedChamps[champ].wins += 1;
      playedLanes[lane].wins += 1;
    }
  });

  // Estadisticas por campeon
  var playedChampsAsList = [];
  for (let champ in playedChamps) {
    var currentChamp = playedChamps[champ];
    currentChamp.winrate = parseFloat(
      ((currentChamp.wins * 100) / currentChamp.timesPlayed).toFixed(2)
    );
    currentChamp.playrate = parseFloat(
      ((currentChamp.timesPlayed * 100) / matchlist.length).toFixed(2)
    );

    playedChampsAsList.push(playedChamps[champ]);
  }
  var bestWinrateChamps = playedChampsAsList.sort(
    (a, b) => b.winrate - a.winrate
  );

  var mostPlayedChamps = playedChampsAsList.sort(
    (a, b) => b.playrate - a.playrate
  );

  if (!all) {
    bestWinrateChamps = bestWinrateChamps.slice(0, 3);
    mostPlayedChamps = mostPlayedChamps.slice(0, 3);
  }

  // Calculo estadisticas por linea
  var lanes = ["Mid", "Jungla", "ADC", "Support", "Top"];
  var lanePlayDistribution = {};
  var laneWinrateDistribution = {};

  lanes.forEach((lane) => {
    if (lane in playedLanes) {
      lanePlayDistribution[lane] = parseFloat(
        (
          ((playedLanes[lane].timesPlayed || 0) * 100) /
          matchlist.length
        ).toFixed(2)
      );
      laneWinrateDistribution[lane] = parseFloat(
        (
          (playedLanes[lane].wins * 100) /
          playedLanes[lane].timesPlayed
        ).toFixed(2)
      );
    }
  });

  return {
    mostPlayedChamps,
    lanePlayDistribution,
    laneWinrateDistribution,
    bestWinrateChamps,
  };
};

const getChampInfo = (assets, id) => {
  if (!id) {
    return null;
  }

  var champ = assets.champions.find((item) => item.championId == id);
  return champ;
};

export const getTagsFromMatchlist = (
  matchlist,
  assets,
  currentChamp,
  position
) => {
  if (!matchlist || matchlist.length < 2) {
    return [];
  }
  var tags = [];

  // ================================
  // Estadisticas por linea y campeon
  // ================================
  var stats = getStatsFromMatchlist(matchlist, true);
  // Main
  var mostPlayedChamp = stats.mostPlayedChamps[0];
  if (matchlist.length > 10 && mostPlayedChamp.playrate > 70) {
    var champ = getChampInfo(assets, mostPlayedChamp.championId);
    tags.push({
      value: `Juega ${champ.name}`,
      tooltip: `${mostPlayedChamp.playrate}% en las últimas partidas (${mostPlayedChamp.winrate}% winrate)`,
      type: "neutral",
    });
  }

  if (currentChamp) {
    var champStats = stats.mostPlayedChamps.find(
      (el) => el.championId == parseInt(currentChamp.championId)
    );

    if (champStats && champStats.timesPlayed > 1) {
      var champ = getChampInfo(assets, champStats.championId);
      var winrate_type = "neutral";
      var playstyle = "Winrate promedio";
      if (champStats.winrate > 60) {
        winrate_type = "good";
        playstyle = "Winrate alto";
      } else if (champStats.winrate < 45) {
        winrate_type = "bad";
        playstyle = "Winrate bajo";
      }

      tags.push({
        tooltip: `${playstyle} con ${champ.name} (${champStats.winrate}% en ${champStats.timesPlayed} partidas)`,
        type: winrate_type,
        value: playstyle,
      });
    } else if (!champStats) {
      tags.push({
        value: `No jugado`,
        tooltip: `No se encontraron partidas recientes con el campeón actual`,
        type: "bad",
      });
    }
  }

  // Linea principal
  var most_played_lane = "Mid";
  for (let lane in stats.lanePlayDistribution) {
    if (
      stats.lanePlayDistribution[lane] >
      stats.lanePlayDistribution[most_played_lane]
    ) {
      most_played_lane = lane;
    }
  }
  var lanePercent = stats.lanePlayDistribution[most_played_lane];
  if (lanePercent > 60) {
    var winrateInLane = stats.laneWinrateDistribution[most_played_lane];
    var type = "neutral";
    if (
      winrateInLane > 60 ||
      (position &&
        most_played_lane.toLowerCase() == position.toLowerCase() &&
        winrateInLane >= 50)
    ) {
      type = "good";
    } else if (winrateInLane < 50) {
      type = "bad";
    }

    tags.push({
      value: `Juega ${most_played_lane}`,
      tooltip: `${lanePercent}% en las últimas partidas (${winrateInLane}% de winrate)`,
      type: "neutral",
    });
  }

  // =========================
  // Rachas
  // =========================
  if (matchlist.length > 3) {
    var win = matchlist[0].win;
    var racha = 1;
    for (let i = 1; i < matchlist.length; i++) {
      if (win != matchlist[i].win) {
        break;
      } else {
        racha += 1;
      }
    }

    if (racha > 2) {
      tags.push({
        value: `Racha de ${win ? "wins" : "loses"}`,
        tooltip: `${win ? "Ganó" : "Perdió"} ${racha} partidas seguidas`,
        type: win ? "good" : "bad",
      });
    }
  }

  // =========================
  // Partidas en el dia
  // =========================
  var now = moment();
  var todayMatches = 0;
  for (let i = 0; i < matchlist.length; i++) {
    let match = matchlist[i];
    var match_time = moment.unix(match.timestamp / 1000);
    if (now.diff(match_time, "days") <= 1) {
      todayMatches += 1;
    } else {
      break;
    }
  }

  if (todayMatches == 0) {
    tags.push({
      value: `Primera del día`,
      tooltip: `El invocador acaba de empezar a jugar`,
      type: "neutral",
    });
  } else {
    tags.push({
      value: `${todayMatches} partidas`,
      tooltip: `${todayMatches} partidas en las últimas 24 horas`,
      type: "neutral",
    });
  }

  // Detecto intentional feeding
  var lowKdaMatches = 0;
  for (let i = 0; i < matchlist.length; i++) {
    let match = matchlist[i];
    if (match.kda < 0.3) {
      lowKdaMatches += 1;
    } else if (match.kda >= 0.8) {
      break;
    }
  }

  if (lowKdaMatches > 1) {
    tags.push({
      value: `Posible Inter`,
      tooltip: `${lowKdaMatches} partidas con un KDA muy bajo`,
      type: "bad",
    });
  }

  // Detecto buenos kda
  var highKda = 0;
  for (let i = 0; i < matchlist.length; i++) {
    let match = matchlist[i];
    if (match.kda > 3) {
      highKda += 1;
    } else if (match.kda < 1.5) {
      break;
    }
  }

  if (highKda > 2) {
    tags.push({
      value: `Buen KDA`,
      tooltip: `${highKda} partidas con un kda alto`,
      type: "good",
    });
  }

  return tags;
};

export const getTagsFromData = (data, assets, selectedChamp) => {
  if (!data) {
    return [];
  }
  var tags = [];

  if (data.isInPromo) {
    tags.push({
      value: "En promo",
      tooltip: "El jugador se encuentra en promo",
      type: "neutral",
    });
  }
  if (selectedChamp && data.masteryLevels) {
    var index = 0;
    var current_champ_mastery = data.masteryLevels.find((el, i) => {
      index = i;
      return el.championId == parseInt(selectedChamp.championId);
    });

    if (current_champ_mastery) {
      if (index < 3) {
        tags.push({
          value: `Main ${selectedChamp.name}`,
          tooltip: `${selectedChamp.name} es el top ${
            index + 1
          } de maestría (${numberToDots(
            current_champ_mastery.championPoints
          )})`,
          type: "good",
        });
      }
    }
  }

  return tags;
};

export const getWarningFromTagList = (taglist) => {
  var warning_level = 0;

  taglist.forEach((tag) => {
    if (tag.type == "good") {
      warning_level--;
    } else if (tag.type == "bad") {
      warning_level++;
    }
  });

  if (warning_level > 1) return "warning";
  else if (warning_level < -1) return "good";

  return "";
};

// Utilidades
export const fillZero = (number) => {
  return number >= 10 ? number : `0${number}`;
};
export const secondsToTime = (seconds) => {
  seconds = Math.round(seconds);

  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return `${fillZero(mins)}:${fillZero(secs)}`;
};
