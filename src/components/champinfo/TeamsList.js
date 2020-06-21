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
} from "../../functions/gameSession";
import PlayerItem from "./PlayerItem";

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

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  render() {
    const { alone } = this.props;
    const myTeam = this.getMyTeam();
    const theirTeam = this.getEnemyTeam();

    return (
      <div
        className={classnames("teams", {
          "teams--alone": alone,
        })}
      >
        <div className="team">
          <div className="team__title">Equipo aliado</div>
          <div className="team__list">
            {myTeam.map((player, i) => {
              return <PlayerItem player={player} key={i} />;
            })}
          </div>
        </div>
        {theirTeam.length > 0 && (
          <div className="team">
            <div className="team__title">Equipo enemigo</div>
            <div className="team__list">
              {theirTeam.map((player, i) => {
                return <PlayerItem player={player} key={i} />;
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
});

export default connect(mapStateToProps, null)(TeamsList);
