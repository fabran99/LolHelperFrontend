import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateGameinfo,
  initializeCurrentGameSocket,
  stopFetchingCurrentGame,
  startFetchingCurrentGame,
} from "../../redux/ingame/ingame.actions";
import { electron } from "../../helpers/outsideObjects";

export class IngameHandler extends Component {
  // pollGameInfo() {
  //   const { ingame, lcuConnector } = this.props;

  //   if (this.timeoutGetData) {
  //     clearTimeout(this.timeoutGetData);
  //   }
  //   if (!lcuConnector) {
  //     return;
  //   }

  //   electron.ipcRenderer
  //     .invoke("GET_CURRENT_GAME_DATA", true)
  //     .then((res) => {
  //       this.processNewInfo(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       this.timeoutGetData = setTimeout(() => {
  //         this.pollGameInfo();
  //       }, 3000);
  //     });
  // }

  // processNewInfo(data) {
  //   if (this.timeoutGetData) {
  //     clearTimeout(this.timeoutGetData);
  //   }
  //   // Parseo la info
  //   if (!data) {
  //     this.timeoutGetData = setTimeout(() => {
  //       this.pollGameInfo();
  //     }, 3000);
  //     return;
  //   }
  //   try {
  //     var parsedData = JSON.parse(data);
  //   } catch {
  //     this.timeoutGetData = setTimeout(() => {
  //       this.pollGameInfo();
  //     }, 3000);

  //     return;
  //   }

  //   // Si la partida esta en curso polleo mas seguido, sino significa que esta
  //   // En pantalla de carga
  //   var gameStarted =
  //     parsedData.events.Events && parsedData.events.Events.length > 0;
  //   const { updateGameinfo, ingame } = this.props;
  //   var newState = {
  //     ...parsedData,
  //     isInGame: true,
  //   };

  //   updateGameinfo(newState);

  //   this.timeoutGetData = setTimeout(
  //     () => {
  //       this.pollGameInfo();
  //     },
  //     gameStarted ? 1000 : 5000
  //   );
  // }

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  initializeCurrentGameSocket,
  stopFetchingCurrentGame,
  startFetchingCurrentGame,
};

export default connect(null, mapDispatchToProps)(IngameHandler);
