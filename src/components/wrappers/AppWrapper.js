import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../utility/Loading";

import {
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
  lobbyChange,
} from "../../actions/lcuConnectorActions";
import { updateSummoner } from "../../actions/summonerActions";
import { updateConfig } from "../../actions/configActions";
import { getAssets } from "../../actions/assetsActions";
import { electron } from "../../helpers/outsideObjects";
import { toast } from "react-toastify";
import IngameHandler from "./IngameHandler";
import ConfigurationHandler from "./ConfigurationHandler";
import Configuration from "../configuration/Configuration";

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
        // Guardo la conexion
        lcuConnect(data);
      }
    );
    // Check disconnected
    this.lcu_disconnect_listener = electron.ipcRenderer.on(
      "LCU_DISCONNECT",
      () => {
        lcuDisconnect();
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
    const { location } = this.props.history;
    const { assets, lcuConnector } = this.props;
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

    // Pido datos del summoner si me logueo

    if (!prevProps.lcuConnector.connected && lcuConnector.connected) {
      setTimeout(() => {
        this.getSummonerData(0);
      }, 500);
    } else if (prevProps.lcuConnector.connected && !lcuConnector.connected) {
      // Elimino los datos del summoner si me deslogueo
      this.deleteSummonerData();
    }
  }

  getSummonerData(retrys) {
    const { lcuConnector, updateSummoner } = this.props;
    if (!lcuConnector.connection) {
      return null;
    }
    // Pido datos del summoner
    var data = JSON.stringify({ connection: lcuConnector.connection });
    electron.ipcRenderer
      .invoke("GET_CURRENT_SUMMONER_DATA", data)
      .then((res) => {
        if (res.errorCode) {
          setTimeout(() => {
            if (retrys < 5) {
              this.getSummonerData(retrys + 1);
            }
          }, 3000);
        } else {
          var summData = {
            summonerId: res.summonerId,
            summonerLevel: res.summonerLevel,
            accountId: res.accountId,
            displayName: res.displayName,
            profileIconId: res.profileIconId,
            puuid: res.puuid,
          };
          updateSummoner(summData);
        }
      })
      .catch((err) => {
        console.log(err);

        setTimeout(() => {
          if (retrys < 15) {
            this.getSummonerData(retrys + 1);
          }
        }, 3000);
      });
  }

  deleteSummonerData() {
    const { updateSummoner } = this.props;
    updateSummoner({
      summonerId: null,
      accountId: null,
      displayName: null,
      puuid: null,
      profileIconId: null,
      summonerLevel: null,
    });
  }

  render() {
    const { assets, lcuConnector, configuration } = this.props;
    if (!assets.champions) {
      return <Loading />;
    }

    var currentPhase = lcuConnector.gameSession.phase;

    return (
      <React.Fragment>
        {configuration.configurationVisible && <Configuration />}
        {currentPhase == "InProgress" && lcuConnector.connected && (
          <IngameHandler />
        )}
        <ConfigurationHandler />
        {this.props.children}
      </React.Fragment>
    );
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
  updateSummoner,
})(withRouter(AppWrapper));
