import React, { Component } from "react";
import { connect } from "react-redux";

import {
  doughnutOptions,
  doughnutDatasetStyles,
} from "../../helpers/chartDefaults";

import { Doughnut } from "react-chartjs-2";

export class DoughnutStats extends Component {
  render() {
    const { champ } = this.props;

    if (!champ) {
      return null;
    }

    var doughnutDataset = {
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

    return (
      <div className="chart_container">
        <div className="doughnut_container">
          <Doughnut options={doughnutOptions} data={doughnutDataset} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DoughnutStats);
