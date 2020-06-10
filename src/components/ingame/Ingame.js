import React, { Component } from "react";
import { connect } from "react-redux";
import AppContent from "../wrappers/AppContent";

import ChampSelect from "./ChampSelect";
import NotIngame from "./NotIngame";

export class Ingame extends Component {
  render() {
    const { gameSession } = this.props;
    return (
      <AppContent>
        {gameSession.phase == "ChampSelect" && <ChampSelect />}
        {gameSession.phase == "None" && <NotIngame />}
      </AppContent>
    );
  }
}

const mapStateToProps = (state) => ({
  gameSession: state.lcuConnector.gameSession,
});

export default connect(mapStateToProps, null)(Ingame);
