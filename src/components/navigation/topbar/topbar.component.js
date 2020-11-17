import React from "react";
import { connect } from "react-redux";
import { selectSummonerIsLogged } from "../../../redux/summoner/summoner.selectors";
import SummonerSummary from "./subcomponents/summonerSummary/summonerSummary.component";

import "./topbar.styles.scss";

const TopBar = ({ summonerIsLogged }) => {
  return (
    <div className="topbar">{summonerIsLogged && <SummonerSummary />}</div>
  );
};

const mapStateToProps = (state) => ({
  summonerIsLogged: selectSummonerIsLogged(state),
});

export default connect(mapStateToProps, null)(TopBar);
