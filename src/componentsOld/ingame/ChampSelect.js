import React, { Component } from "react";
import { connect } from "react-redux";

import { getGameName, getSelectedChamp } from "../../functions/gameSession";
import { updateConfig } from "../../redux/config/config.actions";

import ChampImage from "../champSelectionElements/ChampImage";
import TeamsList from "../champSelectionElements/TeamsList";

import Loading from "../utility/Loading";

export class ChampSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runesApplied: false,
      runeButtonDisabled: false,
    };
  }

  getGameName() {
    const { gameSession } = this.props;
    return getGameName(gameSession);
  }
  getSelectedChamp() {
    const { champSelect } = this.props;
    return getSelectedChamp(champSelect);
  }

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  // componentWillUnmount() {
  //   const { configuration, updateConfig } = this.props;
  //   if (configuration.autoImportRunes && configuration.dontAutoImportRunesNow) {
  //     updateConfig({ dontAutoImportRunesNow: false });
  //   }
  // }

  render() {
    const { champSelect } = this.props;
    if (!champSelect) {
      return <Loading />;
    }

    var champ = this.getChampInfo(this.getSelectedChamp());
    return (
      <div className="champSelect">
        <div className="header_text header_text--long">
          {this.getGameName()}
        </div>
        <div className="row">
          {/* Imagen */}
          <div className="col-3">
            <div className="champSelect__image">
              <ChampImage champ={champ} />
            </div>
          </div>

          {/* Teams */}
          <div className="col-9">
            <TeamsList alone={!champ} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  champSelect: state.lcuConnector.champSelect,
  gameSession: state.lcuConnector.gameSession,
  assets: state.assets,
  configuration: state.configuration,
});

export default connect(mapStateToProps, { updateConfig })(ChampSelect);
