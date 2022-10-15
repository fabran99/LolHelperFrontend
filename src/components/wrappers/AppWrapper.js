import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../utility/Loading";

import { electron } from "../../helpers/outsideObjects";
import { toast } from "react-toastify";

import { initializeLcuConnSocket } from "../../redux/lcuConnector/lcuConnector.actions";
import {
  initializeBuildAppliedEvent,
  initializeBuildFailedEvent,
} from "../../redux/settings/settings.actions";
import { initializeChampSelectSocket } from "../../redux/champSelect/champSelect.actions";
import { initializeGameSessionSocket } from "../../redux/gameSession/gameSession.actions";
import { initializeLobbySocket } from "../../redux/lobby/lobby.actions";
import { initializeGetAssets } from "../../redux/assets/assets.actions";
import {
  initializeCurrentGameSocket,
  startFetchingCurrentGame,
  stopFetchingCurrentGame,
} from "../../redux/ingame/ingame.actions";
import { gameSessionChange } from "../../redux/gameSession/gameSession.actions";

// Selectors
import {
  selectIsTFT,
  selectCurrentPhase,
} from "../../redux/gameSession/gameSession.selectors";
import {
  selectAssetsLoaded,
  selectLolVersion,
} from "../../redux/assets/assets.selectors";
import { selectSettingsVisible } from "../../redux/settings/settings.selectors";
import { selectLcuIsConnected } from "../../redux/lcuConnector/lcuConnector.selectors";

import ConfigurationHandler from "./ConfigurationHandler";
import Configuration from "../configuration/Configuration";

export class AppWrapper extends Component {
  componentDidMount() {
    this.initListeners();
  }

  initListeners() {
    const {
      initializeChampSelectSocket,
      initializeGameSessionSocket,
      initializeLobbySocket,
      initializeLcuConnSocket,
      initializeCurrentGameSocket,
      initializeGetAssets,
      initializeBuildAppliedEvent,
      initializeBuildFailedEvent,
    } = this.props;

    initializeChampSelectSocket();
    initializeGameSessionSocket();
    initializeLobbySocket();
    initializeLcuConnSocket();
    initializeCurrentGameSocket();
    initializeBuildAppliedEvent();
    initializeBuildFailedEvent();
    initializeGetAssets();

    // Updates
    this.update_listener = electron.ipcRenderer.on(
      "updateReady",
      (event, data) => {
        this.showUpdateIsReady(data);
      }
    );

    electron.ipcRenderer.send("WORKING", true);
  }

  showUpdateIsReady(data) {
    const { version } = data;
    const UpdateComponent = () => {
      return (
        <div className="update_notif">
          <div className="update_notif__text">Version {version} disponible</div>
          <div className="update_notif__button">
            <button onClick={this.quitAndInstall.bind(this)}>Actualizar</button>
          </div>
        </div>
      );
    };
    this.toastUpdate = toast(UpdateComponent, {
      position: "bottom-left",
      autoClose: false,
      closeOnClick: false,
    });
  }

  quitAndInstall() {
    toast.dismiss(this.toastUpdate);
    electron.ipcRenderer.send("quitAndInstall");
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props.history;
    const { lolVersion, lcuConnected, isTFT, currentPhase } = this.props;
    // Me aseguro de scrollear la pag
    if (location.pathname !== prevProps.history.location.pathname) {
      window.scrollTo(0, 0);
    }

    // Si cambia la version muestro cartel
    if (prevProps.lolVersion && prevProps.lolVersion !== lolVersion) {
      // Muestro cartel
      toast.info(`Nueva version de LOL ${lolVersion}.`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    // Empiezo a hacer fetch de la partida actual si estoy en partida
    if (
      currentPhase === "InProgress" &&
      lcuConnected &&
      !isTFT &&
      !(
        prevProps.currentPhase === "InProgress" &&
        prevProps.lcuConnected &&
        !prevProps.isTFT
      )
    ) {
      this.props.startFetchingCurrentGame();
    } else if (
      !(currentPhase === "InProgress" && lcuConnected && !isTFT) &&
      prevProps.currentPhase === "InProgress" &&
      prevProps.lcuConnected &&
      !prevProps.isTFT
    ) {
      this.props.gameSessionChange({ data: { teams: null } });
      this.props.stopFetchingCurrentGame();
    }
  }

  render() {
    const { settingsVisible, assetsLoaded } = this.props;
    if (!assetsLoaded) {
      return (
        <React.Fragment>
          {settingsVisible && <Configuration />}
          <Loading />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {settingsVisible && <Configuration />}
        <ConfigurationHandler />
        {this.props.children}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  settingsVisible: selectSettingsVisible(state),
  assetsLoaded: selectAssetsLoaded(state),
  currentPhase: selectCurrentPhase(state),
  isTFT: selectIsTFT(state),
  lcuConnected: selectLcuIsConnected(state),
  lolVersion: selectLolVersion(state),
});

const mapDispatchToProps = {
  initializeChampSelectSocket,
  initializeGameSessionSocket,
  initializeLobbySocket,
  initializeLcuConnSocket,
  initializeCurrentGameSocket,
  initializeGetAssets,
  initializeBuildAppliedEvent,
  initializeBuildFailedEvent,
  startFetchingCurrentGame,
  stopFetchingCurrentGame,
  gameSessionChange,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AppWrapper));
