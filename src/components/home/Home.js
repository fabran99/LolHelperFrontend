import React, { Component } from "react";
import { connect } from "react-redux";
import ChampRanking from "./ChampRanking";
import ChampionList from "../lists/ChampionList";
import AppContent from "../wrappers/AppContent";

export class Home extends Component {
  render() {
    const { assets } = this.props;
    return (
      <AppContent>
        <div className="home">
          <ChampRanking />
          <div className="header_text header_text--low_margin d-none">
            Campeones
          </div>
          <div className="home__separator"></div>
          <ChampionList list={assets.champions} />
        </div>
      </AppContent>
    );
  }
}

const mapStatetoProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStatetoProps, null)(Home);
