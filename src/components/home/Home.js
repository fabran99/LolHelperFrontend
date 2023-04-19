import React, { Component } from "react";
import { connect } from "react-redux";
import ChampRanking from "./ChampRanking";
import ChampionList from "../lists/ChampionList";
import AppContent from "../wrappers/AppContent";
import { selectAssetsLoaded } from "../../redux/assets/assets.selectors";

const Home = ({ assetsLoaded }) => {
  return (
    <AppContent>
      <div className="home">
        <ChampRanking />
        <div className="header_text header_text--low_margin d-none">
          Campeones
        </div>
        <div className="home__separator"></div>
        {assetsLoaded && <ChampionList />}
      </div>
    </AppContent>
  );
};

const mapStatetoProps = (state) => ({
  assetsLoaded: selectAssetsLoaded,
});

export default connect(mapStatetoProps, null)(Home);
