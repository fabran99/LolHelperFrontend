export const getGameName = (gameSession) => {
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
