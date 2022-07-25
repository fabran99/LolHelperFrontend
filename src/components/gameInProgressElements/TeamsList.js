import React, { Component } from "react";
import { connect } from "react-redux";
import PlayerItem from "../gameInProgressElements/PlayerItem";
import { getTeamStats } from "../../functions/ingameFunctions";
import { secondsToTime } from "../../helpers/general";
import TeamListHeader from "./TeamListHeader";

export class TeamsList extends Component {
  getTimer() {
    const { ingame } = this.props;
    var timer = null;
    if (ingame && ingame.gameData && ingame.gameData.gameTime) {
      // Agrego un segundo
      timer = secondsToTime(ingame.gameData.gameTime);
    }

    return timer;
  }

  render() {
    var { theirTeam, myTeam, localTeam, ingame, assets } = this.props;
    if (!myTeam || !theirTeam) {
      return null;
    }

    var myTeamStats = getTeamStats(
      myTeam,
      theirTeam,
      ingame,
      localTeam,
      assets
    );
    var theirTeamStats = getTeamStats(
      theirTeam,
      myTeam,
      ingame,
      localTeam == "teamOne" ? "teamTwo" : "teamOne",
      assets
    );

    var timer = this.getTimer();

    return (
      <div className="teams">
        <div className="row">
          {/* Cabecera */}
          <div className="col-12">
            <TeamListHeader
              myTeamStats={myTeamStats}
              theirTeamStats={theirTeamStats}
              timer={timer}
            />
          </div>

          {/* Team aliado */}
          <div className="col-6">
            <div className="team">
              <div className="team__list">
                {myTeam.map((player, i) => {
                  return <PlayerItem player={player} key={i} enemy={false} />;
                })}
              </div>

              <div className="team__stats">{}</div>
            </div>
          </div>

          {/* Team rival */}
          <div className="col-6">
            <div className="team">
              <div className="team__list">
                {theirTeam.map((player, i) => {
                  return <PlayerItem player={player} key={i} enemy={true} />;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  configuration: state.settings,
  summoner: state.summoner,
  ingame: state.ingame,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TeamsList);
