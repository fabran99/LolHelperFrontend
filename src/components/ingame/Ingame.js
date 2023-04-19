import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppContent from "../wrappers/AppContent";
import ChampSelect from "./ChampSelect";
import NotIngame from "./NotIngame";
import Lobby from "./Lobby";
import GameInProgress from "./GameInProgress";

import { selectAssetsLoaded } from "../../redux/assets/assets.selectors";
import {
  selectCurrentPhase,
  selectIsTFT,
} from "../../redux/gameSession/gameSession.selectors";

const Ingame = ({ assetsLoaded, isTFT, currentPhase }) => {
  var lobbyPhases = ["Lobby", "Matchmaking", "ReadyCheck"];
  if (!assetsLoaded) {
    //  || assets.champions.length == 0
    return <Redirect to="/" />;
  }

  if (currentPhase == "ChampSelect") {
    return (
      <AppContent>
        <ChampSelect />
      </AppContent>
    );
  } else if (lobbyPhases.indexOf(currentPhase) != -1) {
    return (
      <AppContent>
        <Lobby />
      </AppContent>
    );
  } else if (currentPhase == "InProgress" && !isTFT) {
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
};

const mapStateToProps = (state) => ({
  assetsLoaded: selectAssetsLoaded(state),
  isTFT: selectIsTFT(state),
  currentPhase: selectCurrentPhase(state),
});

export default connect(mapStateToProps, null)(Ingame);
