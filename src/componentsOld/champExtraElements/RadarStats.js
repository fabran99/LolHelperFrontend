import React, { Component } from "react";
import { connect } from "react-redux";

import {
  radarDatasetStylesAvg,
  radarOptions,
  radarDatasetStylesSelected,
} from "../../helpers/chartDefaults";

import { Radar } from "react-chartjs-2";

export class RadarStats extends Component {
  // estadisticas
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

    if (!champ) {
      return null;
    }

    const radarLabels = ["Kills", "Deaths", "Assists", "CS/Min", "Damage"];

    var radarDatasets = [
      // {
      //   data: this.getRadarAvg(),
      //   label: "Promedio",
      //   ...radarDatasetStylesAvg,
      // },
      {
        data: this.getStatsAspercent(champ),
        label: champ.name,
        ...radarDatasetStylesSelected,
      },
    ];

    var radarData = {
      labels: radarLabels,
      datasets: radarDatasets,
    };

    var optionsRadar = {
      ...radarOptions,
      legend: {
        display: false,
      },
    };

    return (
      <div className="chart_container">
        <div className="radar_container">
          <Radar data={radarData} options={optionsRadar} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RadarStats);
