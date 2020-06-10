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

export class AppWrapper extends Component {
  componentDidMount() {
    const { getAssets } = this.props;
    getAssets();
    this.initListeners();
  }

  initListeners() {
    const {
      lcuDisconnect,
      lcuConnect,
      gameflowChange,
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
