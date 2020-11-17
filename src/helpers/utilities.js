import moment from "moment";
export const DATE_FORMAT = "DD/MM/YYYY HH:mm";

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

export const fillZero = (number) => {
  return number >= 10 ? number : `0${number}`;
};
export const secondsToTime = (seconds) => {
  seconds = Math.round(seconds);

  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return `${fillZero(mins)}:${fillZero(secs)}`;
};

export const milisecondsToDate = (miliseconds) =>
  moment.unix(miliseconds / 1000).format(DATE_FORMAT);

// Juego

export const getLaneFromRole = (role, lane) => {
  if (lane == "TOP") {
    return "Top";
  } else if (lane == "MID") {
    return "Mid";
  } else if (lane == "JUNGLE") {
    return "Jungla";
  } else if (lane == "BOTTOM") {
    if (role == "DUO_CARRY" || role == "SOLO") {
      return "ADC";
    } else {
      return "Support";
    }
  } else if (lane == "NONE") {
    if (role == "DUO_SUPPORT") {
      return "Support";
    } else if ((role = "DUO_CARRY")) {
      return "ADC";
    }
  }

  return "Jungla";
};

export const queueTypeToName = (queue) => {
  var dictQueues = {
    rank5solo: "Ranked",
    rank5flex: "Flex",
  };

  if (queue in dictQueues) {
    return dictQueues[queue];
  } else {
    return "Normal";
  }
};
