import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../utility/Loading";

import {
  getSelectedChamp,
  playerHasConfirmedPick,
} from "../../functions/gameSession";

import {
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
  lobbyChange,
} from "../../actions/lcuConnectorActions";
import { updateConfig } from "../../actions/configActions";
import { getAssets } from "../../actions/assetsActions";
import { electron } from "../../helpers/outsideObjects";
import { toast } from "react-toastify";

export class AppWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assetTimeout: 1000 * 60 * 10,
    };
  }
  componentDidMount() {
    this.initListeners();
    this.getAssets();
  }

  getAssets() {
    this.props.getAssets();
    this.timeoutAssets = setTimeout(() => {
      this.getAssets();
    }, this.state.assetTimeout);
  }

  retryAssetsFast() {
    toast.error("Error al conectar con el servidor", {
      position: "bottom-left",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    if (this.timeoutAssets) {
      clearTimeout(this.timeoutAssets);
    }
    this.setState(
      {
        assetTimeout: 1000 * 10,
      },
      () => {
        setTimeout(() => {
          this.getAssets();
        }, 1000 * 10);
      }
    );
  }

  retryAssetsNormal() {
    toast.info("Conectado con el servidor correctamente!", {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    if (this.timeoutAssets) {
      clearTimeout(this.timeoutAssets);
    }
    this.timeoutAssets = setTimeout(() => {
      this.getAssets();
      this.setState({
        assetTimeout: 1000 * 60 * 10,
      });
    }, 1000 * 60 * 10);
  }

  initListeners() {
    const {
      lcuDisconnect,
      lcuConnect,
      champselectchange,
      gamesessionChange,
      lobbyChange,
    } = this.props;

    // Check connected
    this.lcu_connect_listener = electron.ipcRenderer.on(
      "LCU_CONNECT",
      (event, data) => {
        lcuConnect(data);
      }
    );

    // ChampSelect
    this.champselectchange_listener = electron.ipcRenderer.on(
      "CHAMPSELECT_CHANGE",
      (event, data) => {
        champselectchange(data);
      }
    );

    // GameSession
    this.sessionchange_listener = electron.ipcRenderer.on(
      "GAMESESSION_CHANGE",
      (event, data) => {
        gamesessionChange(data);
      }
    );
    this.lobbychange_listener = electron.ipcRenderer.on(
      "LOBBY_CHANGE",
      (event, data) => {
        lobbyChange(data);
      }
    );

    // Check disconnected
    this.lcu_disconnect_listener = electron.ipcRenderer.on(
      "LCU_DISCONNECT",
      () => {
        lcuDisconnect();
      }
    );

    electron.ipcRenderer.send("WORKING", true);
  }

  askLane(data, counter, retrys) {
    if (retrys > 30) {
      return;
    }
    electron.ipcRenderer.invoke("ASK_FOR_LANE", data).then((res) => {
      console.log(res);
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
    // Me aseguro de scrollear la pag
    if (location.pathname !== prevProps.history.location.pathname) {
      window.scrollTo(0, 0);
    }

    // Muestro cartel de error si no se pudo actualizar los assets
    if (!prevProps.assets.error && assets.error) {
      this.retryAssetsFast();
    } else if (prevProps.assets.error && !assets.error) {
      this.retryAssetsNormal();
    }

    // Si cambia la version muestro cartel
    if (
      prevProps.assets.lol_version &&
      prevProps.assets.lol_version != assets.lol_version
    ) {
      // Muestro cartel
      toast.info(`Nueva version de LOL ${assets.lol_version}.`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    const {
      autoNavigate,
      autoAcceptMatch,
      autoImportRunes,
      dontAutoImportRunesNow,
    } = configuration;
    // Manejo de fases
    var prevPhase = prevProps.lcuConnector.gameSession.phase;
    var currentPhase = lcuConnector.gameSession.phase;
    var notIngamePhases = ["None", "Lobby", "Matchmaking", "ReadyCheck"];
    var ingamePhases = ["ChampSelect", "InProgress"];

    // Si entro en partida, redirijo a ingame
    if (
      autoNavigate &&
      notIngamePhases.indexOf(prevPhase) != -1 &&
      ingamePhases.indexOf(currentPhase) != -1 &&
      location != "/ingame"
    ) {
      this.props.history.push("/ingame");
    }

    // Si tengo configurado, autoacepto la partida
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

    // Cargar runas automaticamente
    if (
      autoImportRunes &&
      currentPhase == "ChampSelect" &&
      !dontAutoImportRunesNow
    ) {
      var currentSelection = lcuConnector.champSelect;
      var prevSelection = prevProps.lcuConnector.champSelect;
      var currentConfirmPick = playerHasConfirmedPick(currentSelection);
      var prevConfirmPick = playerHasConfirmedPick(prevSelection);
      var currentChamp = getSelectedChamp(currentSelection);
      var prevChamp = getSelectedChamp(prevSelection);

      if (
        (!prevConfirmPick && currentConfirmPick) ||
        (prevConfirmPick && currentConfirmPick && currentChamp != prevChamp)
      ) {
        if (currentChamp) {
          var champ = assets.champions.find(
            (item) => item.championId == currentChamp
          );

          var obj = {
            runePage: champ.runes,
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

    // Auto pedir linea
    var keepAutoAskPhases = [
      "Lobby",
      "Matchmaking",
      "ReadyCheck",
      "ChampSelect",
    ];
    // Quito linea automatica si deje de estar en lobby
    if (
      configuration.autoAskLane != "" &&
      keepAutoAskPhases.indexOf(prevPhase) != -1 &&
      keepAutoAskPhases.indexOf(currentPhase) == -1
    ) {
      console.log("quito");
      console.log(currentPhase);
      updateConfig({ autoAskLane: "" });
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
    const { assets } = this.props;
    if (!assets.champions) {
      return <Loading />;
    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  configuration: state.configuration,
});

export default connect(mapStateToProps, {
  getAssets,
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
  lobbyChange,
  updateConfig,
})(withRouter(AppWrapper));
