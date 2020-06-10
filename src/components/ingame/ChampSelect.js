import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getGameName,
  gameHasBans,
  getCurrentPlayer,
  getSelectedChamp,
  playerHasConfirmedPick,
  getCurrentPhase,
} from "../../functions/gameSession";

import { getLoading } from "../../helpers/getImgLinks";

export class ChampSelect extends Component {
  getGameName() {
    const { gameSession } = this.props;
    return getGameName(gameSession);
  }
  gameHasBans() {
    const { gameSession } = this.props;
    return gameHasBans(gameSession);
  }
  getSelectedChamp() {
    const { champSelect } = this.props;
    return getSelectedChamp(champSelect);
  }
  playerHasConfirmedPick() {
    const { champSelect } = this.props;
    return playerHasConfirmedPick(champSelect);
  }
  getCurrentPlayer() {
    const { champSelect } = this.props;
    return getCurrentPlayer(champSelect);
  }
  getCurrentPhase() {
    const { champSelect } = this.props;
    return getCurrentPhase(champSelect);
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
    const { champSelect, gameSession, assets } = this.props;
    if (!champSelect) {
      return null;
    }

    console.log("GameName");
    console.log(this.getGameName());
    console.log("has bans");
    console.log(this.gameHasBans());
    console.log("currentPlayer");
    console.log(this.getCurrentPlayer());
    console.log("has confirmed pick");
    console.log(this.playerHasConfirmedPick());

    console.log("currentchamp");
    var champ = this.getChampInfo(this.getSelectedChamp());
    console.log("current phase");
    console.log(this.getCurrentPhase());

    return (
      <div className="champSelect">
        En selección de campeon
        <div>
          <img
            src={champ ? getLoading(assets.img_links, champ.key) : ""}
            alt=""
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  champSelect: state.lcuConnector.champSelect,
  gameSession: state.lcuConnector.gameSession,
  assets: state.assets,
});

export default connect(mapStateToProps, null)(ChampSelect);
