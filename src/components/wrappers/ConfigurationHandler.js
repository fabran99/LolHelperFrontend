import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { updateConfig } from "../../redux/settings/settings.actions";
import { electron } from "../../helpers/outsideObjects";

import { parseBuild } from "../../functions/buildLists";

import { selectChampionById } from "../../redux/assets/assets.selectors";
import {
  selectLcuConnection,
  selectLcuIsConnected,
} from "../../redux/lcuConnector/lcuConnector.selectors";
import {
  selectCurrentPhase,
  selectGameQueue,
} from "../../redux/gameSession/gameSession.selectors";
import {
  selectCurrentPlayerHasConfirmedPick,
  selectSelectedChamp,
  selectChatDetails,
} from "../../redux/champSelect/champSelect.selectors";

export class ConfigurationHandler extends Component {
  askLane(data, counter, retrys) {
    if (retrys > 30) {
      return;
    }
    electron.ipcRenderer.invoke("ASK_FOR_LANE", data).then((res) => {
      if (!res.errorCode) {
        if (!counter) {
          this.props.updateConfig({ autoAskLane: "" });
        } else {
          setTimeout(() => {
            this.askLane(data, counter - 1, retrys);
          }, 250);
        }
      } else {
        this.askLane(data, counter, retrys + 1);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props.history;
    const {
      lcuConnection,
      lcuIsConnected,
      gamePhase,
      settings,
      updateConfig,
      getChampionById,
      gameQueue,
      selectedChamp,
      confirmedPick,
      chatDetails,
    } = this.props;

    const {
      autoNavigate,
      autoAcceptMatch,
      autoImportRunes,
      dontAutoImportRunesNow,
      autoImportBuild,
      dontAutoImportBuildNow,
      laneSelectedForRecommendations,
    } = settings;
    // Manejo de fases
    var prevPhase = prevProps.gamePhase;
    var currentPhase = gamePhase;
    var notIngamePhases = ["None", "Lobby", "Matchmaking", "ReadyCheck"];
    var ingamePhases = ["ChampSelect", "InProgress"];

    // Variables del estado de la partida
    var currentConfirmPick = confirmedPick;
    var prevConfirmPick = prevProps.confirmedPick;
    var currentChamp = selectedChamp;
    var prevChamp = prevProps.selectedChamp;

    // ========================================
    // Si entro en partida, redirijo a ingame
    // ========================================
    if (
      autoNavigate &&
      notIngamePhases.indexOf(prevPhase) != -1 &&
      ingamePhases.indexOf(currentPhase) != -1 &&
      location.pathname != "/ingame"
    ) {
      this.props.history.push("/ingame");
    }
    // Si cierro el juego y estaba en ingame lo mando a la principal
    if (
      location.pathname == "/ingame" &&
      prevProps.lcuIsConnected &&
      !lcuIsConnected
    ) {
      this.props.history.push("/");
    }

    // ==========================================
    // Si tengo configurado, autoacepto la partida
    // ==========================================
    if (
      autoAcceptMatch &&
      prevPhase != "ReadyCheck" &&
      currentPhase == "ReadyCheck"
    ) {
      electron.ipcRenderer.invoke(
        "CHECK_READY_FOR_MATCH",
        JSON.stringify({ connection: lcuConnection })
      );
    }

    // =================================
    // Cargar runas y build automaticamente
    // =================================
    if (
      autoImportRunes &&
      currentPhase == "ChampSelect" &&
      !dontAutoImportRunesNow
    ) {
      if (
        (!prevConfirmPick && currentConfirmPick) ||
        (prevConfirmPick && currentConfirmPick && currentChamp != prevChamp) ||
        (prevConfirmPick && currentConfirmPick && currentPhase != prevPhase) ||
        (prevConfirmPick &&
          currentConfirmPick &&
          laneSelectedForRecommendations !=
            prevProps.settings.laneSelectedForRecommendations)
      ) {
        if (currentChamp) {
          var champ = getChampionById(currentChamp);
          var current_lane = laneSelectedForRecommendations;

          if (!current_lane || champ.lanes.indexOf(current_lane) == -1) {
            current_lane = champ.lanes[0];
          }

          var runes = champ.info_by_lane.find(
            (item) => item.lane == current_lane
          ).runes;

          var obj = {
            runePage: runes,
            champName: champ.name,
            connection: lcuConnection,
          };

          this.props.updateConfig({
            changingRunes: true,
          });

          electron.ipcRenderer
            .invoke("CHANGE_RUNES", JSON.stringify(obj))
            .then((res) => {
              this.props.updateConfig({
                changingRunes: false,
              });
            })
            .catch((err) => {
              this.props.updateConfig({
                changingRunes: false,
              });
            });
        }
      }
    }

    // Cargar build automaticamente
    if (
      autoImportBuild &&
      currentPhase == "ChampSelect" &&
      !dontAutoImportBuildNow
    ) {
      if (
        (!prevConfirmPick && currentConfirmPick) ||
        (prevConfirmPick && currentConfirmPick && currentChamp != prevChamp) ||
        (prevConfirmPick && currentConfirmPick && currentPhase != prevPhase)
      ) {
        if (currentChamp) {
          var champ = getChampionById(currentChamp);

          var buildObject = parseBuild(champ);

          updateConfig({
            savingBuild: true,
          });
          console.log("actualizo build");
          electron.ipcRenderer
            .invoke("IMPORT_ITEMS", JSON.stringify(buildObject))
            .then((res) => {
              this.props.updateConfig({
                savingBuild: false,
              });
            })
            .catch((err) => {
              this.props.updateConfig({
                savingBuild: false,
              });
            });
        }
      }
    }

    // Quito dontAutoImportRunesNow si salgo de champSelect
    if (
      dontAutoImportRunesNow &&
      prevPhase == "ChampSelect" &&
      currentPhase != "ChampSelect"
    ) {
      updateConfig({
        dontAutoImportRunesNow: false,
      });
    }

    // Quito dontAutoImportBuildNow si salgo de champSelect
    if (
      dontAutoImportBuildNow &&
      prevPhase == "ChampSelect" &&
      currentPhase != "ChampSelect"
    ) {
      updateConfig({
        dontAutoImportBuildNow: false,
      });
    }

    // =======================================
    // Auto pedir linea
    // =======================================
    var keepAutoAskPhases = [
      "Lobby",
      "Matchmaking",
      "ReadyCheck",
      "ChampSelect",
    ];
    // Quito linea automatica si deje de estar en lobby o cambie de modo
    if (
      settings.autoAskLane != "" &&
      keepAutoAskPhases.indexOf(prevPhase) != -1 &&
      keepAutoAskPhases.indexOf(currentPhase) == -1
    ) {
      updateConfig({ autoAskLane: "" });
    } else if (settings.autoAskLane != "" && gameQueue) {
      var gameModesToAutoPick = ["NORMAL", "BOT"];
      if (
        gameModesToAutoPick.indexOf(gameQueue.type) == -1 ||
        !gameQueue.gameMode == "CLASSIC" ||
        gameQueue.gameTypeConfig.name != "GAME_CFG_TEAM_BUILDER_BLIND"
      ) {
        updateConfig({ autoAskLane: "" });
      }
    }

    if (
      settings.autoAskLane != "" &&
      currentPhase == "ChampSelect" &&
      chatDetails
    ) {
      if (
        chatDetails.chatRoomName != "" &&
        (prevPhase != "ChampSelect" || prevProps.chatDetails.chatRoomName == "")
      ) {
        var data = {
          lane: settings.autoAskLane,
          connection: lcuConnection,
          chatRoomName: chatDetails.chatRoomName,
        };
        setTimeout(() => {
          this.askLane(JSON.stringify(data), 3, 0);
        }, 1500);
      }
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  lcuConnection: selectLcuConnection(state),
  lcuIsConnected: selectLcuIsConnected(state),
  gamePhase: selectCurrentPhase(state),
  champSelect: state.champSelect,
  settings: state.settings,
  getChampionById: (id) => selectChampionById(id)(state),
  gameQueue: selectGameQueue(state),
  confirmedPick: selectCurrentPlayerHasConfirmedPick(state),
  selectedChamp: selectSelectedChamp(state),
  chatDetails: selectChatDetails(state),
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ConfigurationHandler));
