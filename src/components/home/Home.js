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
        <ChampRanking />
        <div className="header_text mt-2">Campeones</div>
        <ChampionList list={assets.champions} />
      </AppContent>
    );
  }
}

const mapStatetoProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStatetoProps, null)(Home);
