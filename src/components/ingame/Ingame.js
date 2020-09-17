import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppContent from "../wrappers/AppContent";
import ChampSelect from "./ChampSelect";
import NotIngame from "./NotIngame";
import Lobby from "./Lobby";
import GameInProgress from "./GameInProgress";

export class Ingame extends Component {
  render() {
    const { gameSession, assets } = this.props;
    var lobbyPhases = ["Lobby", "Matchmaking", "ReadyCheck"];
    if (!assets || assets.champions.length == 0) {
      return <Redirect to="/" />;
    }

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
    } else if (gameSession.phase == "InProgress") {
      return (
        <AppContent>
          <GameInProgress />
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
  assets: state.assets,
});

export default connect(mapStateToProps, null)(Ingame);
