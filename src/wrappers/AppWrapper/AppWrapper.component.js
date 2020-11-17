import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

// Componentes
import Loader from "../../components/loader/loader.component";
// Actions
import { getAssets } from "../../redux/assets/assets.actions";
import {
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
  lobbyChange,
} from "../../redux/lcuConnector/lcuConnector.actions";
import {
  updateSummoner,
  cleanSummoner,
} from "../../redux/summoner/summoner.actions";

// Selectors
import {
  selectChampionInfoExists,
  selectAssetError,
  selectLolVersion,
} from "../../redux/assets/assets.selectors";

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
      lcuDisconnect,
      lcuConnect,
      champselectchange,
      gamesessionChange,
      lobbyChange,
      updateSummoner,
      cleanSummoner,
    } = this.props;

    // Check connected
    this.lcu_connect_listener = electron.ipcRenderer.on(
      "LCU_CONNECT",
      (event, data) => {
        // Guardo la conexion
        lcuConnect(data);
        updateSummoner(data, 0);
      }
    );
    // Check disconnected
    this.lcu_disconnect_listener = electron.ipcRenderer.on(
      "LCU_DISCONNECT",
      () => {
        lcuDisconnect();
        cleanSummoner();
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
    const { assetsError, lolVersion } = this.props;
    // Muestro cartel de error si no se pudo actualizar los assets
    if (!prevProps.assetsError && assetsError) {
      this.retryAssetsFast();
    } else if (prevProps.assetsError && !assetsError) {
      this.retryAssetsNormal();
    }

    // Si cambia la version muestro el cartel
    if (prevProps.lolVersion && prevProps.lolVersion != lolVersion) {
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
});

const mapDispatchToProps = {
  getAssets,
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
  lobbyChange,
  updateSummoner,
  cleanSummoner,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWrapper);
