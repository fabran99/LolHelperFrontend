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
import { updateConfig } from "../../actions/configActions";

import ItemList from "../champinfo/ItemList";
import RuneList from "../champinfo/RuneList";
import StatsList from "../champinfo/StatsList";
import ChampImage from "../champinfo/ChampImage";
import TeamsList from "../champinfo/TeamsList";
import classnames from "classnames";

import { electron } from "../../helpers/outsideObjects";
import CustomTooltip from "../utility/CustomTooltip";
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
    if (
      !champ ||
      this.state.runeButtonDisabled ||
      this.props.configuration.changingRunes
    ) {
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
        electron.ipcRenderer
          .invoke("CHANGE_RUNES", JSON.stringify(obj))
          .then((res) => {
            this.setState({
              runeButtonDisabled: false,
              runesApplied: true,
            });
          })
          .catch((err) => {
            this.setState({
              runeButtonDisabled: false,
              runesApplied: false,
            });
          });
      }
    );
  }

  componentWillUnmount() {
    const { configuration, updateConfig } = this.props;
    if (configuration.autoImportRunes && configuration.dontAutoImportRunesNow) {
      updateConfig({ dontAutoImportRunesNow: false });
    }
  }

  toggleAutoImport() {
    this.props.updateConfig({
      dontAutoImportRunesNow: !this.props.configuration.dontAutoImportRunesNow,
    });
  }

  render() {
    const { champSelect, configuration } = this.props;
    if (!champSelect) {
      return <Loading />;
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

    var noAutoRunes = configuration.dontAutoImportRunesNow;

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
              <div className="champSelect__build fadeIn">
                <div className="row">
                  <div className="col-6">
                    <ItemList champ={champ} />
                  </div>
                  <div className="col-6">
                    <RuneList champ={champ} />
                    <div className="apply_runes">
                      {configuration.autoImportRunes && (
                        <CustomTooltip
                          placement="top"
                          title={
                            noAutoRunes
                              ? "Reactivar"
                              : "Desactivar por esta partida"
                          }
                        >
                          <div
                            className="apply_runes__autoimport"
                            onClick={this.toggleAutoImport.bind(this)}
                          >
                            {noAutoRunes ? (
                              <span>
                                AutoImportar desactivado
                                <i className="fas fa-times"></i>
                              </span>
                            ) : (
                              <span>
                                AutoImportar activado
                                <i className="fas fa-check-circle"></i>
                              </span>
                            )}
                          </div>
                        </CustomTooltip>
                      )}
                      <div
                        className={classnames("lolButton", {
                          disabled:
                            runeButtonDisabled || configuration.changingRunes,
                        })}
                        onClick={this.applyRunes.bind(this)}
                      >
                        <div className="lolButton__border"></div>
                        Aplicar runas
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="column">
            {champ && (
              <div className="champSelect__stats fadeIn">
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
  configuration: state.configuration,
});

export default connect(mapStateToProps, { updateConfig })(ChampSelect);
