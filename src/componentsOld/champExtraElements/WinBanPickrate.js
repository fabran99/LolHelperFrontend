import React, { Component } from "react";
import { connect } from "react-redux";
import { getWinrate } from "../../helpers/general";
import BarRateStat from "../utility/BarRateStat";

export class WinBanPickrate extends Component {
  render() {
    const { champ, configuration, useConfig } = this.props;

    if (!champ) {
      return null;
    }

    const { laneSelectedForRecommendations } = configuration;

    var lane = useConfig ? laneSelectedForRecommendations : "";

    var winrate = getWinrate(champ, lane);
    const winRateContent = () => {
      return (
        <span>
          Winrate <small>({lane ? lane : "Global"})</small>
        </span>
      );
    };
    return (
      <div className="stats">
        <BarRateStat value={winrate} title={winRateContent()} />
        <BarRateStat value={champ.banRate} title={"Banrate"} color="pink" />
        <BarRateStat value={champ.pickRate} title={"Pickrate"} color="green" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configuration: state.configuration,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WinBanPickrate);
