import React, { Component } from "react";
import { connect } from "react-redux";
import AppContent from "../wrappers/AppContent";
import ChampSelect from "./ChampSelect";
import NotIngame from "./NotIngame";
import Lobby from "./Lobby";

export class Ingame extends Component {
  render() {
    const { gameSession } = this.props;
    var lobbyPhases = ["Lobby", "Matchmaking", "ReadyCheck"];
    if (gameSession.phase == "ChampSelect") {
      return (
        <AppContent>
          <ChampSelect />
        </AppContent>
      );
    } else if (lobbyPhases.indexOf(gameSession.phase) != -1) {
      return (
        <AppContent>
          <Lobby />
        </AppContent>
      );
    }

    return (
      <AppContent>
        <NotIngame />
      </AppContent>
    );
  }
}

const mapStateToProps = (state) => ({
  gameSession: state.lcuConnector.gameSession,
});

export default connect(mapStateToProps, null)(Ingame);
