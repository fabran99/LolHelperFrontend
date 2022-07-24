import React, { Component } from "react";
import { connect } from "react-redux";
import { getTeams } from "../../functions/ingameFunctions";

import { getGameName } from "../../functions/gameSession";
import { secondsToTime } from "../../helpers/general";

import ChampImage from "../gameInProgressElements/ChampImage";
import Loading from "../utility/Loading";
import classnames from "classnames";
import TeamsList from "../gameInProgressElements/TeamsList";

export class GameInProgress extends Component {
  getGameName() {
    const { lcuConnector } = this.props;
    return getGameName(lcuConnector.gameSession);
  }

  getTeams() {
    const { lcuConnector, summoner, ingame, assets, gameSession } = this.props;

    return getTeams(gameSession, summoner, ingame, assets);
  }

  render() {
    const { lcuConnector, ingame, summoner } = this.props;
    if (!lcuConnector) {
      return null;
    }
    const { teamOne, teamTwo, localTeam } = this.getTeams();

    if (!summoner) {
      return <Loading />;
    }

    return (
      <div className="inProgress">
        {/* Header */}
        {/* {!timer && (
          <div className="header_text header_text--long">
            {this.getGameName()}
          </div>
        )} */}

        {/* Content */}
        <div className="row">
          <div className="col-3">
            {/* Imagen del champ */}
            <ChampImage />
          </div>
          <div className="col-9">
            {/* Datos de la partida*/}
            <TeamsList
              myTeam={localTeam == "teamOne" ? teamOne : teamTwo}
              theirTeam={localTeam == "teamOne" ? teamTwo : teamOne}
              localTeam={localTeam}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lcuConnector: state.lcuConnector,
  assets: state.assets,
  configuration: state.settings,
  summoner: state.summoner,
  ingame: state.ingame,
  gameSession: state.gameSession,
});

export default connect(mapStateToProps, null)(GameInProgress);
