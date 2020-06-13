import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../utility/Loading";

import {
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
} from "../../actions/lcuConnectorActions";
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
    toast.error("Error al actualizar los assets", {
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
    toast.info("Se actualizaron los assets correctamente!", {
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

    // Check disconnected
    this.lcu_disconnect_listener = electron.ipcRenderer.on(
      "LCU_DISCONNECT",
      () => {
        lcuDisconnect();
      }
    );

    electron.ipcRenderer.send("WORKING", true);
  }

  componentDidUpdate(prevProps) {
    // Me aseguro de scrollear la pag
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }

    // Muestro cartel de error si no se pudo actualizar los assets
    if (!prevProps.assets.error && this.props.assets.error) {
      this.retryAssetsFast();
    } else if (prevProps.assets.error && !this.props.assets.error) {
      this.retryAssetsNormal();
    }

    // Si cambia la version muestro cartel
    if (
      prevProps.assets.lol_version &&
      prevProps.assets.lol_version != this.props.assets.lol_version
    ) {
      // Muestro cartel
      toast.info(`Nueva version de LOL ${this.props.assets.lol_version}.`, {
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
    const { assets } = this.props;
    if (!assets.champions) {
      return <Loading />;
    }
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, {
  getAssets,
  lcuConnect,
  lcuDisconnect,
  champselectchange,
  gamesessionChange,
})(withRouter(AppWrapper));
