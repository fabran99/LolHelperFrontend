import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { lcuConnect, lcuDisconnect } from "../../actions/lcuConnectorActions";
import { getAssets } from "../../actions/assetsActions";

export class AppWrapper extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount() {
  //   const { getAssets } = this.props;
  //   getAssets();

  //   if (window.ipcRenderer) {
  //     this.initWatchers();
  //   }
  // }

  // initWatchers() {
  //   const { lcuDisconnect, lcuConnect } = this.props;

  //   this.lcu_connect_listener = window.ipcRenderer.on(
  //     "LCU_CONNECT",
  //     (event, data) => {
  //       console.log(data);
  //       // setTimeout(() => {
  //       //   console.log("connect");
  //       //   const { auth } = window.league_connect;
  //       //   auth()
  //       //     .then((res) => {
  //       //       console.log(res);
  //       //       if (!this.props.lcuConnector.connected) {
  //       //         lcuConnect(res);
  //       //       }
  //       //     })
  //       //     .catch((err) => {
  //       //       console.log(err);
  //       //     });
  //       //   lcuConnect(null);
  //       // }, 5000);
  //     }
  //   );
  //   this.lcu_socket = window.ipcRenderer.on("LCU_SOCKET", (event, socket) => {
  //     console.log(socket);
  //   });

  //   this.lcu_disconnect_listener = window.ipcRenderer.on(
  //     "LCU_DISCONNECT",
  //     () => {
  //       console.log("disconected");
  //       // lcuDisconnect();
  //     }
  //   );

  //   window.ipcRenderer.send("WORKING", true);
  // }

  componentDidUpdate(prevProps) {
    // Me aseguro de scrollear la pag
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
});

export default connect(mapStateToProps, {
  getAssets,
  lcuConnect,
  lcuDisconnect,
})(withRouter(AppWrapper));
