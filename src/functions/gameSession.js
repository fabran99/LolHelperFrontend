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
  var currentPlayer = getCurrentPlayer(champSelection);
  if (!currentPlayer) {
    return false;
  }

  var pickActions = champSelection.actions.filter((action) => {
    return action.find(
      (y) => y.actorCellId == currentPlayer.cellId && y.type == "pick"
    );
  });

  if (pickActions.length < 0) {
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
      (y) => y.actorCellId == currentPlayer.cellId && y.type == "pick"
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
  var pickActions = champSelection.actions.filter((action) => {
    return action.find((y) => y.actorCellId == cellId && y.type == "pick");
  });

  if (pickActions.length > 0) {
    var lastAction = pickActions[pickActions.length - 1].find(
      (item) => item.actorCellId == cellId
    );
    return lastAction.championId;
  }

  return null;
};

export const getCurrentPhase = (champSelection) => {
  var uncompleted_action = champSelection.actions.filter((action) => {
    return action.filter((y) => !y.completed).length > 0;
  })[0];
  if (uncompleted_action) {
    console.log(uncompleted_action[0]);
    return uncompleted_action[0].type;
  }
  return null;
};

export const isBaning = (champSelection) => {
  return getCurrentPhase(champSelection) == "ban";
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

export const getEnemyTeam = (champSelection) => {
  return champSelection.theirTeam;
};
