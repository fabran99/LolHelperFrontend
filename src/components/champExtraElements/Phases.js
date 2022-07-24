import React, { Component } from "react";
import { connect } from "react-redux";
import CustomTooltip from "../utility/CustomTooltip";
import classnames from "classnames";
import BarRateStat from "../utility/BarRateStat";
import { Line } from "react-chartjs-2";

import { lineOptions } from "../../helpers/chartDefaults";

const PHASES_WINRATES = {
  1: "Menos de 48%",
  2: "48% - 53%",
  3: "Más de 53%",
};

const PHASES_VALUE = {
  1: 35,
  2: 50,
  3: 75,
};

const PHASES_COLOR = {
  1: "pink",
  2: "orange",
  3: "green",
};

const dataFromChamp = (champ) => {
  return (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 170);
    gradient.addColorStop(0, "rgba(20, 163, 230,0.2)");
    gradient.addColorStop(0.7, "rgba(20, 163, 230,0.0)");
    gradient.addColorStop(1, "rgba(20, 163, 230,0)");

    return {
      datasets: [
        {
          label: "Minuto",
          backgroundColor: gradient,
          borderColor: "rgba(20, 163, 230,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgb(56, 192, 255)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgb(56, 192, 255)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          data: [
            {
              x: 20,
              y: PHASES_VALUE[champ.phases_winrate.early],
            },
            {
              x: 30,
              y: PHASES_VALUE[champ.phases_winrate.mid],
            },
            {
              x: 40,
              y: PHASES_VALUE[champ.phases_winrate.late],
            },
          ],
        },
      ],
    };
  };
};

const Phases = ({ champ }) => {
  if (!champ) {
    return null;
  }

  const options = { ...lineOptions };

  return (
    <div className="phases">
      <div className="phases__title">Winrate / Minuto</div>
      <div className="chart_container">
        <div className="line_container">
          <Line data={dataFromChamp(champ)} options={options} height={150} />
        </div>
      </div>
    </div>
  );
};

export default Phases;
