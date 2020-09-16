// Info del game
const SUMMONER_RIFT = 11;
export const isSummonerRift = (gameSession) => {
  if (gameSession && gameSession.gameData && gameSession.gameData.queue) {
    return gameSession.gameData.queue.mapId == SUMMONER_RIFT;
  } else {
    return false;
  }
};

export const getGameName = (gameSession) => {
  if (!gameSession || !gameSession.gameData) {
    return "";
  }
  var isCustom = gameSession.gameData.isCustomGame;
  var queuename = isCustom ? "Custom" : gameSession.gameData.queue.description;
  return `${queuename} - ${gameSession.map.name}`;
};

export const gameHasBans = (gameSession) => {
  return (
    gameSession.gameData.queue.gameTypeConfig.banMode == "StandardBanStrategy"
  );
};

// Info de los jugadores
export const getCurrentPlayer = (champSelection) => {
  if (!champSelection) {
    return null;
  }
  var cellId = champSelection.localPlayerCellId;
  if (cellId == -1) {
    return null;
  }
  return champSelection.myTeam.find((player) => player.cellId == cellId);
};

export const playerHasConfirmedPick = (champSelection) => {
  if (!champSelection) {
    return false;
  }
  var currentPlayer = getCurrentPlayer(champSelection);
  if (!currentPlayer) {
    return false;
  }
  // Reviso si es una seleccion automatica como aram
  var finalAction = champSelection.actions[champSelection.actions.length - 1];
  if (
    champSelection.actions.length == 0 ||
    (finalAction.length > 0 && finalAction[finalAction.length - 1].completed)
  ) {
    var playerSelection = champSelection.myTeam.find((el) => {
      return el.championId && el.cellId == currentPlayer.cellId;
    });
    if (playerSelection) {
      return true;
    }
  }

  var pickActions = champSelection.actions.filter((action) => {
    return action.find(
      (y) =>
        y.actorCellId == currentPlayer.cellId &&
        (y.type == "pick" || y.type == "vote")
    );
  });

  if (pickActions.length > 0) {
    var lastAction = pickActions[pickActions.length - 1].find(
      (item) => item.actorCellId == currentPlayer.cellId
    );
    return lastAction.completed;
  }

  return false;
};

export const getSelectedChamp = (champSelection) => {
  var currentPlayer = getCurrentPlayer(champSelection);
  if (!currentPlayer) {
    return null;
  }
  if (currentPlayer.championId != 0) {
    return currentPlayer.championId;
  }

  var pickActions = champSelection.actions.filter((action) => {
    return action.find(
      (y) =>
        y.actorCellId == currentPlayer.cellId &&
        (y.type == "pick" || y.type == "vote")
    );
  });
  if (pickActions.length > 0) {
    var lastAction = pickActions[pickActions.length - 1].find(
      (item) => item.actorCellId == currentPlayer.cellId
    );
    return lastAction.championId;
  }

  return null;
};

export const getSelectedChampByCellId = (champSelection, cellId) => {
  // Reviso si es una seleccion automatica como aram
  if (champSelection.actions.length == 0) {
    var playerSelection = champSelection.myTeam.find((el) => {
      return el.championId && el.cellId == cellId;
    });
    if (playerSelection) {
      return playerSelection.championId;
    }
  }

  // Sino reviso normalmente
  var pickActions = champSelection.actions.filter((action) => {
    return action.find(
      (y) => y.actorCellId == cellId && (y.type == "pick" || y.type == "vote")
    );
  });

  if (pickActions.length > 0) {
    var lastAction = pickActions[pickActions.length - 1].find(
      (item) => item.actorCellId == cellId
    );
    return lastAction.championId;
  }

  return null;
};

// Fases
export const getCurrentPhase = (champSelection) => {
  var uncompleted_action = champSelection.actions.filter((action) => {
    return action.filter((y) => !y.completed).length > 0;
  })[0];

  if (uncompleted_action) {
    return uncompleted_action[uncompleted_action.length - 1].type;
  }
  return null;
};

export const isBaning = (champSelection) => {
  return getCurrentPhase(champSelection) == "ban";
};

// Manejos de bans e integrantes del team
export const getBanByCellId = (champSelection, cellId) => {
  if (champSelection.actions.length == 0) {
    return null;
  }

  // Sino reviso normalmente
  var banActions = champSelection.actions.filter((action) => {
    return action.find((y) => y.actorCellId == cellId && y.type == "ban");
  });

  if (banActions.length > 0) {
    var lastAction = banActions[banActions.length - 1].find(
      (item) => item.actorCellId == cellId
    );
    return lastAction.championId;
  }

  return null;
};

export const getMyTeam = (champSelection) => {
  var team = champSelection.myTeam.map((item, i) => {
    return {
      ...item,
      isLocalPlayer: item.cellId == champSelection.localPlayerCellId,
    };
  });
  return team;
};

export const getMyTeamBans = (champSelection) => {
  if (champSelection.bans.myTeamBans.length > 0) {
    return champSelection.bans.myTeamBans;
  }

  var myTeam = champSelection.myTeam;

  var bans = [];
  myTeam.forEach((tmember) => {
    var ban = getBanByCellId(champSelection, tmember.cellId);
    if (ban) {
      bans.push(ban);
    }
  });

  return bans;
};

export const getEnemyTeam = (champSelection) => {
  return champSelection.theirTeam;
};

export const getEnemyBans = (champSelection) => {
  if (champSelection.bans.theirTeamBans.length > 0) {
    return champSelection.bans.theirTeamBans;
  }

  var enemyTeam = champSelection.theirTeam;

  var bans = [];
  enemyTeam.forEach((tmember) => {
    var ban = getBanByCellId(champSelection, tmember.cellId);
    if (ban) {
      bans.push(ban);
    }
  });

  return bans;
};

// Manejo de queues
export const NORMALQUEUE = 430;
export const NORMALRECQUEUE = 400;
export const RANKEDQUEUE = 420;
export const FLEXQUEUE = 440;

export const QUEUENAMES = {
  [NORMALQUEUE]: "blind5",
  [NORMALRECQUEUE]: "draft5",
  [RANKEDQUEUE]: "rank5solo",
  [FLEXQUEUE]: "rank5flex",
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

export const VALID_QUEUES = [
  NORMALQUEUE,
  NORMALRECQUEUE,
  RANKEDQUEUE,
  FLEXQUEUE,
];

export const isValidQueue = (gameSession) => {
  try {
    if (QUEUENAMES[gameSession.gameData.queue.id]) {
      return QUEUENAMES[gameSession.gameData.queue.id];
    }
  } catch {
    return null;
  }
  return null;
};

// Manejo de lanes
export const API_LANES = {
  adc: "BOTTOM",
  top: "TOP",
  jungla: "JUNGLE",
  mid: "MID",
  support: "SUPPORT",
};
