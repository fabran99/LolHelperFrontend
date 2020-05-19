import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import ChampRanking from "./ChampRanking";
import ChampionList from "../lists/ChampionList";

export class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { assets, navbar } = this.props;
    return (
      <div
        className={classnames("app_content home_page", {
          nav_visible: navbar.visible,
        })}
      >
        <ChampRanking />
        <div className="header_text mt-2">Campeones</div>
        <ChampionList list={assets.general.content.main_list} />
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  navbar: state.navbar,
});

export default connect(mapStatetoProps, null)(Home);
