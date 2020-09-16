import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  getSummonerChamp,
  getSpellByName,
} from "../../functions/ingameFunctions";
import { getLoading, getSpell } from "../../helpers/getImgLinks";
import CustomTooltip from "../utility/CustomTooltip";
import { secondsToTime } from "../../helpers/general";
import imgPlaceholder from "../../img/placeholder.svg";
import RuneList from "./RuneList";

export class ChampImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOption: "runes",
    };
  }

  // General
  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  // Obtener info
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  getChampInfoByName(name) {
    const { assets } = this.props;
    if (!name) {
      return null;
    }

    var champ = assets.champions.find((item) => item.name == name);
    return champ;
  }

  getSummonerChampInfo() {
    const { lcuConnector, summoner, ingame } = this.props;
    // Si tengo la info de ingame
    if (ingame.allPlayers && summoner.displayName) {
      var playerData = ingame.allPlayers.find(
        (el) => el.summonerName == summoner.displayName
      );
      if (playerData) {
        var champData = this.getChampInfoByName(playerData.championName);
        return champData;
      }
    }
    // Si no la tengo
    var currentChampion = getSummonerChamp(lcuConnector.gameSession, summoner);
    var champData = this.getChampInfo(currentChampion || null);
    return champData;
  }

  getActivePlayerData() {
    const { ingame, summoner } = this.props;

    if (!ingame.activePlayer || !ingame.allPlayers || !summoner.displayName) {
      return null;
    }
    var data = { ...ingame.activePlayer };

    var generalData = ingame.allPlayers.find(
      (el) => el.summonerName == summoner.displayName
    );

    if (generalData) {
      data = { ...data, ...generalData };
    }
    return data;
  }

  render() {
    const { assets, summoner } = this.props;
    const { currentOption } = this.state;

    var champ = this.getSummonerChampInfo();
    var activePlayer = this.getActivePlayerData();

    // Summoners actuales
    var spells = null;
    if (activePlayer && activePlayer.summonerSpells) {
      var spellDesc = [
        activePlayer.summonerSpells.summonerSpellOne.rawDescription,
        activePlayer.summonerSpells.summonerSpellTwo.rawDescription,
      ];
      spells = [];
      spellDesc.forEach((desc, i) => {
        var currentSpell = assets.spells.find(
          (el) => desc.indexOf(el.id) != -1
        );
        if (currentSpell) {
          spells[i] = currentSpell;
        }
      });
    }

    // Runas actuales
    var runes = null;
    if (activePlayer && activePlayer.fullRunes) {
      let { fullRunes } = activePlayer;
      runes = {
        primary: {
          main: fullRunes.primaryRuneTree.id,
          perk0: fullRunes.generalRunes[0].id,
          perk1: fullRunes.generalRunes[1].id,
          perk2: fullRunes.generalRunes[2].id,
          perk3: fullRunes.generalRunes[3].id,
        },
        secondary: {
          main: fullRunes.secondaryRuneTree.id,
          perk4: fullRunes.generalRunes[4].id,
          perk5: fullRunes.generalRunes[5].id,
        },
        perks: {
          statPerk0: fullRunes.statRunes[0].id,
          statPerk1: fullRunes.statRunes[1].id,
          statPerk2: fullRunes.statRunes[2].id,
        },
      };
    }

    if (!champ) {
      return (
        <div className="gameInProgressImage">
          <div className="detailcard">
            <div className="detailcard__background">
              <img
                className="detailcard__placeholder"
                src={imgPlaceholder}
                alt=""
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="gameInProgressImage">
        <div className="detailcard detailcard--squared detailcard--visible">
          <div className="detailcard__border"></div>
          <div
            className={classnames("detailcard__background", {
              "detailcard__background--dead":
                activePlayer &&
                activePlayer.isDead &&
                activePlayer.respawnTimer > 1,
            })}
          >
            {champ && (
              <img src={getLoading(assets.img_links, champ.key)} alt="" />
            )}
          </div>
          <div className="detailcard__overlay"></div>

          <div className="detailcard__text">
            <div className="name">{champ.name}</div>
            <div className="title">{champ.title}</div>
            <div className="summoners">
              {spells &&
                spells.map((spellData, i) => {
                  return (
                    <CustomTooltip
                      key={spellData.id}
                      placement="top"
                      title={
                        <div className="tooltip">
                          <div className="tooltip__title tooltip__title--image">
                            <img
                              src={getSpell(assets.img_links, spellData.id)}
                            />
                            <span>{spellData.name}</span>{" "}
                          </div>
                          <div className="tooltip__content">
                            {spellData.description}
                          </div>
                          <div className="tooltip__subcontent">
                            Cooldown: {spellData.cooldown}s
                          </div>
                        </div>
                      }
                    >
                      <div className="spell">
                        <div className="image">
                          <img src={getSpell(assets.img_links, spellData.id)} />
                        </div>
                      </div>
                    </CustomTooltip>
                  );
                })}
            </div>
          </div>

          {activePlayer &&
            activePlayer.isDead &&
            activePlayer.respawnTimer > 1 && (
              <div className="detailcard__deadtimer">
                {secondsToTime(activePlayer.respawnTimer)}
              </div>
            )}
        </div>

        {/* Opciones a visualizar */}

        <div className="champImageExtraData">
          {!activePlayer && (
            <div className="champImageExtraData__loading">
              Esperando inicio de partida...
            </div>
          )}
          {activePlayer && (
            <div className="champImageExtraData__select">
              <div className="select">
                <select
                  name="currentOption"
                  value={currentOption}
                  onChange={this.handleInput.bind(this)}
                >
                  <option value="runes">Runas actuales</option>
                  {/* <option value="champstats">Estadisticas actuales</option> */}
                </select>
              </div>
            </div>
          )}

          {activePlayer && currentOption == "runes" && (
            <div className="fadeIn">
              <RuneList runes={runes} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  ingame: state.ingame,
  lcuConnector: state.lcuConnector,
  summoner: state.summoner,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChampImage);
