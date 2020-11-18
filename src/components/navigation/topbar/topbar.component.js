import React from "react";
import { connect } from "react-redux";
import { selectSummonerIsLogged } from "../../../redux/summoner/summoner.selectors";
import { selectAssetError } from "../../../redux/assets/assets.selectors";
import SummonerSummary from "./subcomponents/summonerSummary/summonerSummary.component";

import "./topbar.styles.scss";

const TopBar = ({ summonerIsLogged, assetError }) => {
  return (
    <div className="topbar">
      {summonerIsLogged && !assetError && <SummonerSummary />}
    </div>
  );
};

const mapStateToProps = (state) => ({
  summonerIsLogged: selectSummonerIsLogged(state),
  assetError: selectAssetError(state),
});

export default connect(mapStateToProps, null)(TopBar);
