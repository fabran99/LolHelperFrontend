import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  getGameName,
  gameHasBans,
  getCurrentPlayer,
  getSelectedChamp,
  playerHasConfirmedPick,
  getCurrentPhase,
  getMyTeam,
  getEnemyTeam,
  getEnemyBans,
  getMyTeamBans,
} from "../../functions/gameSession";
import PlayerItem from "./PlayerItem";
import BanItem from "./BanItem";
import TeamStats from "./TeamStats";

export class TeamsList extends Component {
  getSelectedChamp() {
    const { champSelect } = this.props;
    return getSelectedChamp(champSelect);
  }

  getCurrentPlayer() {
    const { champSelect } = this.props;
    return getCurrentPlayer(champSelect);
  }

  getMyTeam() {
    const { champSelect } = this.props;
    return getMyTeam(champSelect);
  }
  getEnemyTeam() {
    const { champSelect } = this.props;
    return getEnemyTeam(champSelect);
  }
  getMyTeamBans() {
    const { champSelect } = this.props;
    return getMyTeamBans(champSelect);
  }
  getEnemyBans() {
    const { champSelect } = this.props;
    return getEnemyBans(champSelect);
  }

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  enemiesVisible(team) {
    return team.length > 0;
  }

  render() {
    const { alone } = this.props;
    const myTeam = this.getMyTeam();
    const theirTeam = this.getEnemyTeam();
    const myTeamBans = this.getMyTeamBans();
    const theirTeamBans = this.getEnemyBans();

    const allBans = [...theirTeamBans, ...myTeamBans];

    return (
      <div
        className={classnames("teams", {
          "teams--alone": alone,
        })}
      >
        <div className="row">
          <div
            className={classnames({
              "col-6": theirTeam.length > 0,
              "col-12": theirTeam.length == 0,
            })}
          >
            <div className="team">
              <div className="team__header">
                <div className="team__title">Equipo aliado</div>
                <div className="team__bans">
                  {myTeamBans.map((champId) => {
                    return <BanItem key={champId} champ={champId} />;
                  })}
                </div>
              </div>
              <div className="team__list">
                {myTeam.map((player, i) => {
                  return <PlayerItem player={player} key={i} />;
                })}
              </div>

              <div className="team__stats">
                <TeamStats
                  bans={allBans}
                  enemyTeam={theirTeam}
                  enemy={false}
                  team={myTeam}
                />
              </div>
            </div>
          </div>

          {theirTeam.length > 0 && (
            <div className="col-6">
              <div className="team">
                <div className="team__header">
                  <div className="team__title">Equipo enemigo</div>
                  <div className="team__bans">
                    {theirTeamBans.map((champId) => {
                      return <BanItem key={champId} champ={champId} />;
                    })}
                  </div>
                </div>
                <div className="team__list">
                  {theirTeam.map((player, i) => {
                    return <PlayerItem player={player} key={i} enemy={true} />;
                  })}
                </div>
                <div className="team__stats">
                  <TeamStats
                    bans={allBans}
                    team={theirTeam}
                    enemyTeam={myTeam}
                    enemy
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
});

export default connect(mapStateToProps, null)(TeamsList);
