import React, { Component } from "react";
import { connect } from "react-redux";
import { Radar } from "react-chartjs-2";

import {
  radarDatasetStylesAvg,
  radarOptions,
  radarDatasetStylesSelected,
} from "../../helpers/chartDefaults";

import {
  getGameName,
  gameHasBans,
  getCurrentPlayer,
  getSelectedChamp,
  playerHasConfirmedPick,
  getCurrentPhase,
} from "../../functions/gameSession";
import img_placeholder from "../../img/placeholder.svg";
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

  getRadarAvg() {
    const { assets } = this.props;
    const radarStats = ["kills", "deaths", "assists", "farmPerMin", "damage"];

    var stats = assets.radar_stats.find((x) => x.elo == "high_elo");

    var maxRadar = radarStats.map((stat) => {
      return stats[stat].max;
    });

    var avgRadar = radarStats.map((stat, i) => {
      return Math.round((stats[stat].mean * 100) / maxRadar[i]);
    });
    return avgRadar;
  }

  getStatsAspercent(champ) {
    const { assets } = this.props;
    const radarStats = ["kills", "deaths", "assists", "farmPerMin", "damage"];

    var stats = assets.radar_stats.find((x) => x.elo == "high_elo");
    var maxRadar = radarStats.map((stat) => {
      return stats[stat].max;
    });

    var asPercent = radarStats.map((stat, i) => {
      var max = maxRadar[i];
      return (champ[stat] * 100) / max;
    });
    return asPercent;
  }

  render() {
    const { champSelect, gameSession, assets } = this.props;
    if (!champSelect) {
      return null;
    }

    // console.log("GameName");
    // console.log(this.getGameName());
    // console.log("has bans");
    // console.log(this.gameHasBans());
    // console.log("currentPlayer");
    // console.log(this.getCurrentPlayer());
    // console.log("has confirmed pick");
    // console.log(this.playerHasConfirmedPick());

    console.log("currentchamp");
    var champ = this.getChampInfo(this.getSelectedChamp());
    // console.log("current phase");
    // console.log(this.getCurrentPhase());

    // Radar
    const radarLabels = ["Kills", "Deaths", "Assists", "CS/Min", "Damage"];

    var datasets = [
      {
        data: this.getRadarAvg(),
        label: "Promedio",
        ...radarDatasetStylesAvg,
      },
    ];

    if (champ) {
      datasets.push({
        data: this.getStatsAspercent(champ),
        label: "Campeón actual",
        ...radarDatasetStylesSelected,
      });
    }

    var data = {
      labels: radarLabels,
      datasets,
    };

    var options = {
      ...radarOptions,
    };

    return (
      <div className="champSelect">
        En selección de campeon
        <div className="champSelect__img">
          <img
            src={
              champ ? getLoading(assets.img_links, champ.key) : img_placeholder
            }
            alt=""
          />
          <Radar data={data} options={options} />
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
