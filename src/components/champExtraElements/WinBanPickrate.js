import React from "react";
import { connect } from "react-redux";
import { getWinrate } from "../../helpers/general";
import BarRateStat from "../utility/BarRateStat";
import { selectLaneSelectedForRecommendations } from "../../redux/settings/settings.selectors";

const WinBanPickrate = ({
  champ,
  useConfig,
  laneSelectedForRecommendations,
}) => {
  if (!champ) {
    return null;
  }

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
};

const mapStateToProps = (state) => ({
  laneSelectedForRecommendations: selectLaneSelectedForRecommendations(state),
});

export default connect(mapStateToProps, null)(WinBanPickrate);
