import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateConfig } from "../../actions/configActions";
import { toast } from "react-toastify";
import { electron } from "../../helpers/outsideObjects";

import {
  getSelectedChamp,
  playerHasConfirmedPick,
} from "../../functions/gameSession";
import { parseBuild } from "../../functions/buildLists";

export class ConfigurationHandler extends Component {
  componentDidMount() {
    this.initListeners();
  }

  initListeners() {
    // Check build is imported
    this.build_imported_listener = electron.ipcRenderer.on(
      "BUILD_APPLIED",
      (event, fileExisted) => {
        this.buildIsImported(fileExisted);
      }
    );
    this.build_not_imported_listener = electron.ipcRenderer.on(
      "BUILD_FAILED",
      () => {
        this.buildFailed();
      }
    );
  }

  buildIsImported(buildExisted) {
    this.props.updateConfig({
      savingBuild: false,
    });
    if (!buildExisted) {
      toast.info("Build importada con exito", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  buildFailed() {
    this.props.updateConfig({
      savingBuild: false,
    });
    toast.error("No se pudo importar la build correctamente", {
      position: "bottom-left",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

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
    const { assets, lcuConnector, configuration, updateConfig } = this.props;
    const {
      autoNavigate,
      autoAcceptMatch,
      autoImportRunes,
      dontAutoImportRunesNow,
      autoImportBuild,
      dontAutoImportBuildNow,
      laneSelectedForRecommendations,
    } = configuration;
    // Manejo de fases
    var prevPhase = prevProps.lcuConnector.gameSession.phase;
    var currentPhase = lcuConnector.gameSession.phase;
    var notIngamePhases = ["None", "Lobby", "Matchmaking", "ReadyCheck"];
    var ingamePhases = ["ChampSelect", "InProgress"];

    // Variables del estado de la partida
    var currentSelection = lcuConnector.champSelect;
    var prevSelection = prevProps.lcuConnector.champSelect;
    var currentConfirmPick = playerHasConfirmedPick(currentSelection);
    var prevConfirmPick = playerHasConfirmedPick(prevSelection);
    var currentChamp = getSelectedChamp(currentSelection);
    var prevChamp = getSelectedChamp(prevSelection);

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
      prevProps.lcuConnector.connected &&
      !lcuConnector.connected
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
        JSON.stringify({ connection: lcuConnector.connection })
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
            prevProps.configuration.laneSelectedForRecommendations)
      ) {
        if (currentChamp) {
          var champ = assets.champions.find(
            (item) => item.championId == currentChamp
          );

          //
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
            connection: lcuConnector.connection,
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
          var champ = assets.champions.find(
            (item) => item.championId == currentChamp
          );

          var buildObject = parseBuild(champ);

          updateConfig({
            savingBuild: true,
          });

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
      configuration.autoAskLane != "" &&
      keepAutoAskPhases.indexOf(prevPhase) != -1 &&
      keepAutoAskPhases.indexOf(currentPhase) == -1
    ) {
      updateConfig({ autoAskLane: "" });
    } else if (configuration.autoAskLane != "") {
      var gameModesToAutoPick = ["NORMAL", "BOT"];
      var gameSession = lcuConnector.gameSession;
      if (
        gameModesToAutoPick.indexOf(gameSession.gameData.queue.type) == -1 ||
        !gameSession.gameData.queue.gameMode == "CLASSIC" ||
        gameSession.gameData.queue.gameTypeConfig.name !=
          "GAME_CFG_TEAM_BUILDER_BLIND"
      ) {
        updateConfig({ autoAskLane: "" });
      }
    }

    if (
      configuration.autoAskLane != "" &&
      currentPhase == "ChampSelect" &&
      lcuConnector.champSelect
    ) {
      if (
        lcuConnector.champSelect.chatDetails.chatRoomName != "" &&
        (prevPhase != "ChampSelect" ||
          prevProps.lcuConnector.champSelect.chatDetails.chatRoomName == "")
      ) {
        var data = {
          lane: configuration.autoAskLane,
          connection: lcuConnector.connection,
          chatRoomName: lcuConnector.champSelect.chatDetails.chatRoomName,
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
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  configuration: state.configuration,
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ConfigurationHandler));
