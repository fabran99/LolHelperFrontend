import React, { Component } from "react";
import { connect } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import { Link } from "react-router-dom";

import {
  getGameName,
  gameHasBans,
  getCurrentPlayer,
  getSelectedChamp,
  playerHasConfirmedPick,
  getCurrentPhase,
} from "../../functions/gameSession";
import img_placeholder from "../../img/placeholder.svg";
import { getLoading, getSquare } from "../../helpers/getImgLinks";

import ItemList from "../champinfo/ItemList";
import RuneList from "../champinfo/RuneList";
import StatsList from "../champinfo/StatsList";

export class ChampSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      champ: 127,
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
    // if (!champSelect) {
    //   return null;
    // }

    // console.log("GameName");
    // console.log(this.getGameName());
    // console.log("has bans");
    // console.log(this.gameHasBans());
    // console.log("currentPlayer");
    // console.log(this.getCurrentPlayer());
    // console.log("has confirmed pick");
    // console.log(this.playerHasConfirmedPick());

    console.log("currentchamp");
    // this.getSelectedChamp()
    var champ = this.getChampInfo(this.state.champ);
    // var champ = this.getChampInfo(this.getSelectedChamp());
    // console.log("current phase");
    // console.log(this.getCurrentPhase());

    return (
      <div className="champSelect">
        <div className="header_text header_text--long">
          Seleccionando - Grieta del invocador
        </div>
        <button onClick={this.changeChamp.bind(this)} className="randomBoton">
          {" "}
          click
        </button>
        <div className="three_columns">
          {/* Imagen */}
          <div className="column column--image">
            <div className="champSelect__image">
              {champ ? (
                <div className="champSelectImageContainer">
                  <Link to={`/champion/${champ.key}`} className="detailcard">
                    <div className="detailcard__border"></div>
                    <div className="detailcard__background">
                      <img
                        src={getLoading(assets.img_links, champ.key)}
                        alt=""
                      />
                    </div>
                    <div className="detailcard__overlay"></div>

                    <div className="detailcard__text">
                      <div className="name">{champ.name}</div>
                      <div className="title">{champ.title}</div>
                    </div>
                  </Link>

                  <div className="counters">
                    <div className="counters__section">
                      <div className="counters__title">Fuerte contra</div>
                      <div className="counters__list">
                        {champ.strongAgainst.map((enemy, i) => {
                          var enemyInfo = this.getChampInfo(enemy);
                          return (
                            <div
                              className="counters__list__champ"
                              key={enemyInfo.key}
                            >
                              <Tooltip
                                arrow
                                placement="top"
                                title={enemyInfo.name}
                              >
                                <Link
                                  className="image"
                                  to={`/champion/${enemy.championId}`}
                                >
                                  <img
                                    src={getSquare(
                                      assets.img_links,
                                      enemyInfo.key
                                    )}
                                  />
                                </Link>
                              </Tooltip>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="counters__section">
                      <div className="counters__title">Debil contra</div>
                      <div className="counters__list">
                        {champ.weakAgainst.map((enemy, i) => {
                          var enemyInfo = this.getChampInfo(enemy);
                          return (
                            <div
                              className="counters__list__champ"
                              key={enemyInfo.key}
                            >
                              <Tooltip
                                arrow
                                placement="top"
                                title={enemyInfo.name}
                              >
                                <Link
                                  className="image"
                                  to={`/champion/${enemy.championId}`}
                                >
                                  <img
                                    src={getSquare(
                                      assets.img_links,
                                      enemyInfo.key
                                    )}
                                  />
                                </Link>
                              </Tooltip>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="detailcard">
                  <div className="detailcard__background">
                    <img src={img_placeholder} style={{ width: "485px" }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Build */}
          <div className="column">
            {champ ? (
              <div className="champSelect__build">
                <ItemList champ={champ} />

                {/* <div className="separator"></div> */}
                <RuneList champ={champ} />

                <div className="lolButton">
                  <div className="lolButton__border"></div>
                  Aplicar runas
                </div>
              </div>
            ) : (
              <div className="noChampSelected">
                <div className="icon">?</div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="column">
            {champ ? (
              <div className="champSelect__stats">
                <StatsList champ={champ} />
              </div>
            ) : (
              <div className="noChampSelected">
                <div className="icon">?</div>
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
