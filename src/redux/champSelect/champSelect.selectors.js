import { createSelector } from "reselect";

const baseSelect = (state) => state.champSelect;
const selectLocalPlayerId = (state) =>
  state.champSelect ? state.champSelect.localPlayerCellId : null;
const selectActions = (state) =>
  state.champSelect ? state.champSelect.actions : null;
const selectMyTeam = (state) =>
  state.champSelect ? state.champSelect.myTeam : null;
const selectEnemyTeam = (state) =>
  state.champSelect ? state.champSelect.theirTeam : null;
const selectBans = (state) =>
  state.champSelect ? state.champSelect.bans : null;

// Utility

const getBanByCellId = (actions, cellId) => {
  if (!actions || actions.length == 0) {
    return null;
  }

  // Sino reviso normalmente
  var banActions = actions.filter((action) => {
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

const getMyTeamBans = (bans, myTeam, actions) => {
  if (!bans || !myTeam || !actions) {
    return null;
  }

  if (bans.myTeamBans.length > 0) {
    return bans.myTeamBans;
  }
  var bans = [];
  myTeam.forEach((tmember) => {
    var ban = getBanByCellId(actions, tmember.cellId);
    if (ban) {
      bans.push(ban);
    }
  });

  return bans;
};

const getEnemyTeamBans = (bans, theirTeam, actions) => {
  if (!bans || !theirTeam || !actions) {
    return null;
  }
  if (bans.theirTeam.length > 0) {
    return bans.theirTeam;
  }
  var bans = [];
  theirTeam.forEach((tmember) => {
    var ban = getBanByCellId(actions, tmember.cellId);
    if (ban) {
      bans.push(ban);
    }
  });

  return bans;
};

// Selectors
export const selectChampSelectionValid = createSelector(
  [baseSelect],
  (champSelection) => !!champSelection
);

export const selectChampSelection = createSelector(
  [baseSelect],
  (champSelection) => champSelection
);

export const selectCurrentPlayer = createSelector(
  [selectLocalPlayerId, selectMyTeam],
  (localPlayerCellId, myTeam) => {
    if (!myTeam || localPlayerCellId == -1) {
      return null;
    }
    return myTeam.find((player) => player.cellId == localPlayerCellId);
  }
);

export const selectCurrentPlayerHasConfirmedPick = createSelector(
  [selectActions, selectLocalPlayerId, selectMyTeam],
  (actions, localPlayerCellId, myTeam) => {
    if (!actions || !myTeam) {
      return false;
    }
    // Reviso si es una seleccion automatica como aram
    var finalAction = actions[actions.length - 1];
    if (
      actions.length == 0 ||
      (finalAction.length > 0 && finalAction[finalAction.length - 1].completed)
    ) {
      var playerSelection = myTeam.find((el) => {
        return el.championId && el.cellId == localPlayerCellId;
      });
      if (playerSelection) {
        return true;
      }
    }

    var pickActions = actions.filter((action) => {
      return action.find(
        (y) =>
          y.actorCellId == localPlayerCellId &&
          (y.type == "pick" || y.type == "vote")
      );
    });

    if (pickActions.length > 0) {
      var lastAction = pickActions[pickActions.length - 1].find(
        (item) => item.actorCellId == localPlayerCellId
      );
      return lastAction.completed;
    }

    return false;
  }
);

export const selectSelectedChampByCellId = (cellId) =>
  createSelector([selectActions, selectMyTeam], (actions, myTeam) => {
    if (!actions || !myTeam) {
      return null;
    }
    // Reviso si es una seleccion automatica como aram
    if (actions.length == 0) {
      var playerSelection = myTeam.find((el) => {
        return el.championId && el.cellId == cellId;
      });
      if (playerSelection) {
        return playerSelection.championId;
      }
    }

    // Sino reviso normalmente
    var pickActions = actions.filter((action) => {
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
  });

export const selectSelectedChamp = createSelector(
  [selectActions, selectLocalPlayerId, selectMyTeam],
  (actions, localPlayerCellId, myTeam) => {
    if (!actions || localPlayerCellId == null) {
      return null;
    }
    // Reviso si es una seleccion automatica como aram
    if (actions.length == 0) {
      var playerSelection = myTeam.find((el) => {
        return el.championId && el.cellId == localPlayerCellId;
      });
      if (playerSelection) {
        return playerSelection.championId;
      }
    }

    // Sino reviso normalmente
    var pickActions = actions.filter((action) => {
      return action.find(
        (y) =>
          y.actorCellId == localPlayerCellId &&
          (y.type == "pick" || y.type == "vote")
      );
    });

    if (pickActions.length > 0) {
      var lastAction = pickActions[pickActions.length - 1].find(
        (item) => item.actorCellId == localPlayerCellId
      );
      return lastAction.championId;
    }
    return null;
  }
);

export const selectCurrentSelectionPhase = createSelector(
  [selectActions],
  (actions) => {
    if (!actions) {
      return null;
    }
    var uncompleted_action = actions.filter((action) => {
      return action.filter((y) => !y.completed).length > 0;
    })[0];

    if (uncompleted_action) {
      return uncompleted_action[uncompleted_action.length - 1].type;
    }
    return null;
  }
);

export const selectCurrentlyBanning = createSelector(
  [selectCurrentSelectionPhase],
  (phase) => phase == "ban"
);

export const selectGetBanByCellId = (cellId) => {
  createSelector([selectActions], (actions) => {
    getBanByCellId(actions, cellId);
  });
};

export const selectGetMyTeamBans = createSelector(
  [selectBans, selectMyTeam, selectActions],
  (bans, myTeam, actions) => getMyTeamBans(bans, myTeam, actions)
);

export const selectGetEnemyTeamBans = createSelector(
  [selectBans, selectEnemyTeam, selectActions],
  (bans, enemyTeam, actions) => getEnemyTeamBans(bans, enemyTeam, actions)
);

export const selectChatDetails = createSelector([baseSelect], (champSelect) =>
  champSelect ? champSelect.chatDetails : null
);
