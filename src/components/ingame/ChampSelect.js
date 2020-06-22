import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getGameName,
  gameHasBans,
  getCurrentPlayer,
  getSelectedChamp,
  playerHasConfirmedPick,
  getCurrentPhase,
} from "../../functions/gameSession";

import ItemList from "../champinfo/ItemList";
import RuneList from "../champinfo/RuneList";
import StatsList from "../champinfo/StatsList";
import ChampImage from "../champinfo/ChampImage";
import TeamsList from "../champinfo/TeamsList";
import classnames from "classnames";

import { updateRunePage } from "../../functions/runePage";
import { electron } from "../../helpers/outsideObjects";

export class ChampSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champ: 127,
      runesApplied: false,
      runeButtonDisabled: false,
    };
  }

  getGameName() {
    const { gameSession } = this.props;
    return getGameName(gameSession);
  }
  gameHasBans() {
    const { gameSession } = this.props;
    return gameHasBans(gameSession);
  }
  getSelectedChamp() {
    const { champSelect } = this.props;
    return getSelectedChamp(champSelect);
  }
  playerHasConfirmedPick() {
    const { champSelect } = this.props;
    return playerHasConfirmedPick(champSelect);
  }
  getCurrentPlayer() {
    const { champSelect } = this.props;
    return getCurrentPlayer(champSelect);
  }
  getCurrentPhase() {
    const { champSelect } = this.props;
    return getCurrentPhase(champSelect);
  }

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  applyRunes() {
    var champ = this.getChampInfo(this.getSelectedChamp());
    if (!champ || this.state.runeButtonDisabled) {
      return;
    }
    this.setState(
      {
        runeButtonDisabled: true,
      },
      () => {
        var obj = {
          runePage: champ.runes,
          champName: champ.name,
          connection: this.props.connection,
        };
        electron.ipcRenderer.send("CHANGE_RUNES", JSON.stringify(obj));
      }
    );
  }

  componentDidMount() {
    this.runesChanged = (event, data) => {
      this.setState(data);
    };
    electron.ipcRenderer.on("RUNES_UPDATED", this.runesChanged);
  }

  componentWillUnmount() {
    electron.ipcRenderer.removeListener("RUNES_UPDATED", this.runesChanged);
  }

  changeChamp() {
    const { assets } = this.props;
    var random =
      assets.champions[Math.floor(Math.random() * assets.champions.length)];
    console.log(random.championId);
    this.setState({
      champ: random.championId,
    });
  }

  render() {
    const { champSelect, gameSession, assets } = this.props;
    if (!champSelect) {
      return null;
    }

    const { runeButtonDisabled } = this.state;

    // console.log("GameName");
    // console.log(this.getGameName());
    // console.log("has bans");
    // console.log(this.gameHasBans());
    // console.log("currentPlayer");
    // console.log(this.getCurrentPlayer());
    // console.log("has confirmed pick");
    // console.log(this.playerHasConfirmedPick());

    // this.getSelectedChamp()
    // var champ = this.getChampInfo(this.state.champ);
    var champ = this.getChampInfo(this.getSelectedChamp());
    // console.log("current phase");
    // console.log(this.getCurrentPhase());

    return (
      <div className="champSelect">
        <div className="header_text header_text--long">
          {this.getGameName()}
        </div>
        {/* <button onClick={this.changeChamp.bind(this)} className="randomBoton">
          click
        </button> */}
        <div className="three_columns">
          {/* Imagen */}
          <div className="column column--image">
            <div className="champSelect__image">
              {champ && <ChampImage champ={champ} />}
            </div>
          </div>

          {/* Build */}
          <div className="column">
            <TeamsList alone={!champ} />
            {champ && (
              <div className="champSelect__build">
                <div className="row">
                  <div className="col-6">
                    <ItemList champ={champ} />
                  </div>
                  <div className="col-6">
                    {/* <div className="separator"></div> */}
                    <RuneList champ={champ} />
                    <div
                      className={classnames("lolButton", {
                        disabled: runeButtonDisabled,
                      })}
                      onClick={this.applyRunes.bind(this)}
                    >
                      <div className="lolButton__border"></div>
                      Aplicar runas
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="column">
            {champ && (
              <div className="champSelect__stats">
                <StatsList champ={champ} />
              </div>
            )}
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
});

export default connect(mapStateToProps, null)(ChampSelect);
