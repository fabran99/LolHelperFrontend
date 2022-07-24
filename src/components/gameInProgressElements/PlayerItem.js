import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { getSquare, getSpell, getItem } from "../../helpers/getImgLinks";
import { electron } from "../../helpers/outsideObjects";
import PlayerDetailModal from "../playerDetail/PlayerDetailModal";
import imgPlaceholder from "../../img/placeholder.svg";
import CustomTooltip from "../utility/CustomTooltip";
import {
  numberToDots,
  getTagsFromMatchlist,
  getTagsFromData,
  getWarningFromTagList,
  secondsToTime,
} from "../../helpers/general";

import minionIcon from "../../img/minion_icon.png";
import wardIcon from "../../img/support_icon.png";
import goldIcon from "../../img/gold_icon.png";
import moment from "moment";

const INGAME_TEAM_NAMES = {
  teamOne: "ORDER",
  teamTwo: "CHAOS",
};

export class PlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      division: null,
      tier: null,
      displayName: null,
      puuid: null,
      summonerId: null,
      summonerLevel: null,
      accountId: null,
      profileIconId: null,
      wins: null,
      isInPromo: null,
      bestChamps: null,
      masteryLevels: null,
      matchlist: null,
      detailModalVisible: false,
    };
  }

  getChampInfoByKey(key) {
    const { assets } = this.props;
    if (!key) {
      return null;
    }

    var champ = assets.champions.find((item) => item.key == key);
    return champ;
  }

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  getItemInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var item = assets.items.find((item) => parseInt(item.id) == id);
    return item;
  }

  componentDidMount() {
    if (this.props.player.summonerId) {
      this.getPlayerInfo();
    }
  }

  getPlayerInfo() {
    const { player, connection } = this.props;
    const { summonerId } = player;

    this.setState({
      summonerId,
    });

    // Solicito info general del jugador
    electron.ipcRenderer
      .invoke(
        "GET_SUMMONER_INFO_BY_ID",
        JSON.stringify({ connection, summonerId })
      )
      .then((res) => {
        const {
          puuid,
          displayName,
          accountId,
          summonerLevel,
          profileIconId,
        } = res;

        this.setState(
          {
            puuid,
            displayName,
            accountId,
            summonerLevel,
            profileIconId,
          },
          () => {
            this.getPlayerRankData();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    // Info de mejores champs del jugador
    electron.ipcRenderer
      .invoke(
        "GET_BEST_CHAMPS_BY_ID",
        JSON.stringify({ connection, summonerId })
      )
      .then((res) => {
        var bestChamps = res.masteries.map((champ) => {
          const { championId, championPoints } = champ;
          return { championId, championPoints };
        });
        this.setState({ bestChamps });
      })
      .catch((err) => {
        console.log(err);
      });

    // Pido info de las maestrias
    electron.ipcRenderer
      .invoke(
        "GET_SUMMONER_MASTERIES_BY_ID",
        JSON.stringify({ connection, summonerId })
      )
      .then((res) => {
        // Ordeno descendentemente por maestria
        res = res.sort((a, b) => b.championPoints - a.championPoints);
        this.setState({
          masteryLevels: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getPlayerRankData() {
    const { connection } = this.props;
    const { puuid, summonerId, displayName } = this.state;

    // Solicito info de las ranked del jugador
    electron.ipcRenderer
      .invoke(
        "GET_RANKED_STATS_BY_PUUID",
        JSON.stringify({ connection, puuid })
      )
      .then((res) => {
        var key = puuid || Object.keys(res)[0];
        var data = res[key].queueMap["RANKED_SOLO_5x5"];
        var { tier, wins, division } = data;
        var isInPromo = data.miniSeriesProgress != "";
        this.setState({
          tier,
          wins,
          division,
          isInPromo,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Solicito info de las partidas del jugador
    electron.ipcRenderer
      .invoke("GET_MATCHLIST_BY_PUUID", JSON.stringify({ connection, puuid, summonerId, displayName, host:process.env.REACT_APP_HOST }))
      .then((res) => {
        this.setState({
          matchlist: res,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openModal() {
    const { displayName, puuid, summonerId } = this.state;
    if (displayName && puuid && summonerId) {
      this.setState({
        detailModalVisible: true,
      });
    }
  }

  closeModal() {
    this.setState({ detailModalVisible: false });
  }

  render() {
    const { assets, player, enemy } = this.props;

    const {
      displayName,
      masteryLevels,
      detailModalVisible,
      tier,
      division,
    } = this.state;

    var selectedChamp = this.getChampInfo(player.championId);

    // Spells del jugador
    var player_spells = [];
    var valid_spells = assets.spells.map((spell) => parseInt(spell.key));

    // Tooltip de mastery
    const masteryData = () => {
      if (!selectedChamp) return "No hay datos de maestria";

      var current_champ_mastery = null;
      if (masteryLevels && selectedChamp) {
        current_champ_mastery = masteryLevels.find(
          (el) => el.championId == parseInt(selectedChamp.championId)
        );
      }

      if (!current_champ_mastery) {
        return "No hay datos de maestria";
      }

      return (
        <div className="tooltip">
          <div className="tooltip__title">
            {displayName ? (
              <span>
                {" "}
                {displayName}
                <small> ({selectedChamp.name})</small>
              </span>
            ) : (
              selectedChamp.name
            )}
          </div>
          {/* Datos de maestria */}
          {current_champ_mastery && (
            <div className="mastery">
              <div className="row">
                <div className="col-4">
                  <div className="mastery__image">
                    {
                      <img
                        src={getSquare(assets.img_links, selectedChamp.key)}
                      />
                    }
                  </div>
                </div>

                <div className="col-8">
                  <div className="mastery__data">
                    <div>
                      Puntos de maestria:{" "}
                      <div className="value">
                        {numberToDots(current_champ_mastery.championPoints)}
                      </div>
                    </div>
                    <div>
                      Nivel de maestria:{" "}
                      <div className="value ">
                        {current_champ_mastery.championLevel}
                      </div>
                    </div>
                    <div>
                      Jugado por última vez:{" "}
                      <div className="value d-block">
                        {moment
                          .unix(current_champ_mastery.lastPlayTime / 1000)
                          .format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    // Info del jugador
    if (selectedChamp) {
      var index1 = valid_spells.indexOf(player.spell1Id);
      var index2 = valid_spells.indexOf(player.spell2Id);
      if (index1 != -1) {
        player_spells.push(assets.spells[index1]);
      }
      if (index2 != -1) {
        player_spells.push(assets.spells[index2]);
      }

      //   Si no lo tengo, lo busco por el nombre dentro del juego
      if (player_spells.length == 0 && player && player.summonerSpells) {
        var spells = [
          player.summonerSpells.summonerSpellOne.displayName,
          player.summonerSpells.summonerSpellTwo.displayName,
        ];

        var valid_spell_names = assets.spells.map((spell) => spell.name);
        var index1 = valid_spell_names.indexOf(spells[0]);
        var index2 = valid_spell_names.indexOf(spells[1]);

        if (index1 != -1) {
          player_spells.push(assets.spells[index1]);
        }
        if (index2 != -1) {
          player_spells.push(assets.spells[index2]);
        }
      }
    }

    var isRespawning = false;
    if (player) {
      isRespawning = player.isDead && player.respawnTimer > 1;
    }

    var playerGold = 0;
    if (player.items) {
      player.items.forEach((item) => {
        var itemPrice = assets.items.find((el) => el.id == item.itemID);
        if (itemPrice) {
          playerGold += itemPrice.price * item.count;
        }
      });
    }

    return (
      <div>
        {detailModalVisible && (
          <PlayerDetailModal
            data={{ ...this.state }}
            close={this.closeModal.bind(this)}
            selectedChamp={selectedChamp}
          />
        )}
        <div
          className={classnames("player", {
            "player--red": enemy,
          })}
        >
          {/* Tooltip del campeon */}
          <CustomTooltip placement="left" title={masteryData()}>
            <div
              className={classnames("player__image", {
                "player__image--local": player.localPlayer,
              })}
            >
              <img src={imgPlaceholder} alt="" />

              {isRespawning && (
                <div className="player__timer">
                  {Math.round(player.respawnTimer)}
                </div>
              )}
              {selectedChamp && (
                <img
                  src={getSquare(assets.img_links, selectedChamp.key)}
                  className={classnames({
                    dead: isRespawning,
                  })}
                />
              )}
            </div>
          </CustomTooltip>

          <div className="player__data" onClick={this.openModal.bind(this)}>
            {player && player.level && (
              <div className="player__level">{player.level}</div>
            )}
            <div className="player__spells">
              {player_spells.map((spell) => {
                return (
                  <CustomTooltip
                    key={spell.id}
                    placement="top"
                    title={
                      <div className="tooltip">
                        <div className="tooltip__title tooltip__title--image">
                          <img src={getSpell(assets.img_links, spell.id)} />
                          <span>{spell.name}</span>{" "}
                        </div>
                        <div className="tooltip__content">
                          {spell.description}
                        </div>
                        <div className="tooltip__subcontent">
                          Cooldown: {spell.cooldown}s
                        </div>
                      </div>
                    }
                  >
                    <div className="player__spells__img fadeIn">
                      <img src={getSpell(assets.img_links, spell.id)} />
                    </div>
                  </CustomTooltip>
                );
              })}
            </div>

            <div className="player__name__small">
              {player.displayName}{" "}
              <small>
                {!!tier &&
                  !!division &&
                  tier != "NONE" &&
                  `(${tier} ${division})`}
              </small>
            </div>

            {/* Build */}
            <div
              className={classnames("player__build", {
                "player__build--nospells":
                  !player_spells || player_spells.length == 0,
              })}
            >
              {[...new Array(7)].map((el, i) => {
                var item =
                  player && player.items
                    ? player.items.find((item) => item.slot == i)
                    : null;
                var itemInfo = item ? this.getItemInfo(item.itemID) : null;

                if (!itemInfo) {
                  return (
                    <div key={i} className="player__build__item">
                      <div className="empty"></div>
                    </div>
                  );
                } else {
                  return (
                    <CustomTooltip
                      key={i}
                      placement="top"
                      title={
                        <div className="tooltip">
                          <div className="tooltip__title tooltip__title--image">
                            <img
                              src={getItem(assets.img_links, itemInfo.id)}
                              alt=""
                            />{" "}
                            <span>{itemInfo.name}</span>
                          </div>

                          <div className="tooltip__content">
                            {itemInfo.description}
                          </div>
                          <div className="tooltip__subcontent">
                            Precio: {itemInfo.price}
                          </div>
                        </div>
                      }
                    >
                      <div className="player__build__item">
                        <div className="player__build__item__container">
                          <img
                            src={getItem(assets.img_links, itemInfo.id)}
                            alt=""
                          />
                        </div>
                      </div>
                    </CustomTooltip>
                  );
                }
              })}
            </div>

            {/* Score */}

            {player && player.scores && (
              <div className="player__score">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div className="kda">
                          <div className="kills">{player.scores.kills}</div>
                          <div className="score_separator">/</div>

                          <div className="deaths">{player.scores.deaths}</div>
                          <div className="score_separator">/</div>
                          <div className="assists">{player.scores.assists}</div>
                        </div>
                      </td>
                      <td>
                        <div className="farm">
                          <img src={minionIcon} alt="" />
                          <div className="value">
                            {player.scores.creepScore}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="gold">
                        <img src={goldIcon} alt="" />
                        {numberToDots(playerGold)}
                      </td>
                      <td>
                        <div className="vision">
                          <img src={wardIcon} alt="" />
                          <div className="value">
                            {parseInt(player.scores.wardScore)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lcuConnector: state.lcuConnector,
  assets: state.assets,
  configuration: state.configuration,
  summoner: state.summoner,
  ingame: state.ingame,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerItem);
