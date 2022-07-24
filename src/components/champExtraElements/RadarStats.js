import React from "react";
import { connect } from "react-redux";

import {
  radarOptions,
  radarDatasetStylesSelected,
} from "../../helpers/chartDefaults";
import { selectRadarStatsByElo } from "../../redux/assets/assets.selectors";

import { Radar } from "react-chartjs-2";

const getStatsAsPercent = (champ, stats) => {
  const radarStats = ["kills", "deaths", "assists", "farmPerMin", "damage"];

  var maxRadar = radarStats.map((stat) => {
    return stats[stat].max;
  });

  var asPercent = radarStats.map((stat, i) => {
    var max = maxRadar[i];
    return (champ[stat] * 100) / max;
  });
  return asPercent;
};

const RadarStats = ({ champ, radarStatsByElo }) => {
  if (!champ) {
    return null;
  }

  const radarLabels = ["Kills", "Deaths", "Assists", "CS/Min", "Damage"];

  var radarDatasets = [
    {
      data: getStatsAsPercent(champ, radarStatsByElo["high_elo"]),
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
};

const mapStateToProps = (state) => ({
  radarStatsByElo: selectRadarStatsByElo(state),
});

export default connect(mapStateToProps, null)(RadarStats);
