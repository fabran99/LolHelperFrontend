import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

// Componentes
import Loader from "../../components/loader/loader.component";
// Actions
import { getAssets } from "../../redux/assets/assets.actions";
import { initializeLcuConnSocket } from "../../redux/lcuConnector/lcuConnector.actions";
import { initializeChampSelectSocket } from "../../redux/champSelect/champSelect.actions";
import { initializeGameSessionSocket } from "../../redux/gameSession/gameSession.actions";
import { initializeLobbySocket } from "../../redux/lobby/lobby.actions";
import {
  initializeCurrentGameSocket,
  stopFetchingCurrentGame,
  startFetchingCurrentGame,
} from "../../redux/ingame/ingame.actions";

// Selectors
import {
  selectChampionInfoExists,
  selectAssetError,
  selectLolVersion,
} from "../../redux/assets/assets.selectors";
import { selectGamePhase } from "../../redux/gameSession/gameSession.selectors";

// Helpers
import { electron } from "../../helpers/outsideObjects";

export class AppWrapper extends Component {
  state = {
    assetTimeout: 1000 * 60 * 10,
  };

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
      initializeChampSelectSocket,
      initializeGameSessionSocket,
      initializeLobbySocket,
      initializeLcuConnSocket,
      initializeCurrentGameSocket,
    } = this.props;

    initializeChampSelectSocket();
    initializeGameSessionSocket();
    initializeLobbySocket();
    initializeLcuConnSocket();
    initializeCurrentGameSocket();

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
    const {
      assetsError,
      lolVersion,
      gamePhase,
      startFetchingCurrentGame,
      fetching,
      stopFetchingCurrentGame,
    } = this.props;
    console.log(prevProps.gamePhase, gamePhase);

    var shouldStartFetching =
      prevProps.gamePhase != gamePhase && gamePhase == "InProgress";
    var sholdStopFetching = fetching && gamePhase != "InProgress";
    var assetsFailed = !prevProps.assetsError && assetsError;
    var assetsRecovered = prevProps.assetsError && !assetsError;
    var isNewLolVersion =
      prevProps.lolVersion && prevProps.lolVersion != lolVersion;

    if (shouldStartFetching) {
      startFetchingCurrentGame();
    } else if (sholdStopFetching) {
      stopFetchingCurrentGame();
      console.log("stop");
    }
    // Muestro cartel de error si no se pudo actualizar los assets
    if (assetsFailed) {
      this.retryAssetsFast();
    } else if (assetsRecovered) {
      this.retryAssetsNormal();
    }
    console.log("test");

    // Si cambia la version muestro el cartel
    if (isNewLolVersion) {
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
  }

  render() {
    const { champInfoExists } = this.props;
    if (!champInfoExists) {
      return (
        <React.Fragment>
          <Loader />
        </React.Fragment>
      );
    }

    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}

const mapStateToProps = (state) => ({
  assetsError: selectAssetError(state),
  lolVersion: selectLolVersion(state),
  champInfoExists: selectChampionInfoExists(state),
  gamePhase: selectGamePhase(state),
  fetching: state.ingame.fetchingGame,
});

const mapDispatchToProps = {
  getAssets,
  initializeChampSelectSocket,
  initializeGameSessionSocket,
  initializeLobbySocket,
  initializeLcuConnSocket,
  initializeCurrentGameSocket,
  stopFetchingCurrentGame,
  startFetchingCurrentGame,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
