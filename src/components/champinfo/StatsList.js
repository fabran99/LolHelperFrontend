import React, { Component } from "react";
import { connect } from "react-redux";

import {
  radarDatasetStylesAvg,
  radarOptions,
  radarDatasetStylesSelected,
  doughnutOptions,
  doughnutDatasetStyles,
} from "../../helpers/chartDefaults";

import { Radar, Doughnut } from "react-chartjs-2";
import ListStat from "../lists/ListStat";

export class StatsList extends Component {
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
    const { champ } = this.props;

    const radarLabels = ["Kills", "Deaths", "Assists", "CS/Min", "Damage"];

    var radarDatasets = [
      {
        data: this.getRadarAvg(),
        label: "Promedio",
        ...radarDatasetStylesAvg,
      },
    ];

    var doughnutDataset = null;

    radarDatasets.push({
      data: this.getStatsAspercent(champ),
      label: "Campeón actual",
      ...radarDatasetStylesSelected,
    });

    doughnutDataset = {
      datasets: [
        {
          data: [
            champ.damageTypes.physical,
            champ.damageTypes.magic,
            champ.damageTypes.true,
          ],
          ...doughnutDatasetStyles,
        },
      ],
      labels: ["AD", "AP", "True"],
    };

    var radarData = {
      labels: radarLabels,
      datasets: radarDatasets,
    };

    var optionsRadar = {
      ...radarOptions,
    };
    return (
      <div className="statlist">
        <div className="stats">
          <ListStat value={champ.winRate} title={"Winrate"} />
          <ListStat value={champ.banRate} title={"Banrate"} color="pink" />
          <ListStat value={champ.pickRate} title={"Pickrate"} color="green" />
        </div>
        <div className="chartjscontainer mt-2">
          <div className="chartjscontainer__box">
            <Radar data={radarData} options={optionsRadar} />
          </div>
        </div>
        <div className="chartjscontainer">
          <div className="chartjscontainer__box chartjscontainer__box--doughnut">
            <Doughnut options={doughnutOptions} data={doughnutDataset} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(StatsList);
