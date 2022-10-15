import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import CustomTooltip from "../utility/CustomTooltip";
import { getSquare, getSpell } from "../../helpers/getImgLinks";
import imgPlaceholder from "../../img/placeholder.svg";
import { getSelectedChampByCellId } from "../../functions/gameSession";
import moment from "moment";
import {
  numberToDots,
  getTagsFromMatchlist,
  getTagsFromData,
  getWarningFromTagList,
} from "../../helpers/general";
import PlayerDetailModal from "../playerDetail/PlayerDetailModal";
import Tag from "../utility/Tag";
import { selectLcuConnection } from "../../redux/lcuConnector/lcuConnector.selectors";
import { selectPlayerBySummonerId } from "../../redux/players/players.selectors";
import { updatePlayerData } from "../../redux/players/players.actions";
import {
  asyncGetSummonerInfoByID,
  getBestChampsBySummonerId,
  getSummonerMasteriesById,
  getPlayerRankedData,
  getMatchlistByPuuid,
} from "../../electron/getLauncherData";

const positions_dict = {
  utility: "Support",
  middle: "Mid",
  top: "Top",
  bottom: "ADC",
  jungle: "Jungla",
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

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  componentDidMount() {
    if (this.props.player.summonerId) {
      this.getPlayerInfo();
    }
  }

  getSelectedChamp() {
    const { champSelect, player } = this.props;
    return getSelectedChampByCellId(champSelect, player.cellId);
  }

  getPlayerInfo() {
    const { player, connection, selectPlayer, updatePlayerData } = this.props;
    const { summonerId } = player;

    this.setState({
      summonerId,
    });

    let currentPlayerData = selectPlayer(summonerId);
    if (currentPlayerData && currentPlayerData.infoIsComplete) {
      let currentDate = new Date();
      let lastUpdate = new Date(currentPlayerData.lastUpdate);
      // Check if the last update is from 15 minutes ago or less
      if (currentDate - lastUpdate < 1000 * 60 * 15) {
        this.setState({
          ...currentPlayerData,
        });
        return;
      }
    }

    // Solicito info general del jugador
    asyncGetSummonerInfoByID(connection, summonerId)
      .then((res) => {
        const { puuid, displayName, accountId, summonerLevel, profileIconId } =
          res;

        this.setState(
          {
            puuid,
            displayName,
            accountId,
            summonerLevel,
            profileIconId,
          },
          () => {
            updatePlayerData({ ...this.state });
            this.getPlayerRankData();
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    // Info de mejores champs del jugador
    getBestChampsBySummonerId(connection, summonerId)
      .then((res) => {
        var bestChamps = res.masteries.map((champ) => {
          const { championId, championPoints } = champ;
          return { championId, championPoints };
        });
        this.setState({ bestChamps }, () => {
          updatePlayerData({ ...this.state });
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // Pido info de las maestrias
    getSummonerMasteriesById(connection, summonerId)
      .then((res) => {
        // Ordeno descendentemente por maestria
        res = res.sort((a, b) => b.championPoints - a.championPoints);
        this.setState(
          {
            masteryLevels: res,
          },
          () => {
            updatePlayerData({ ...this.state });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getPlayerRankData() {
    const { connection, updatePlayerData } = this.props;
    const { puuid, summonerId, displayName } = this.state;

    // Solicito info de las ranked del jugador

    getPlayerRankedData(connection, puuid)
      .then((res) => {
        var key = puuid || Object.keys(res)[0];
        var data = res[key].queueMap["RANKED_SOLO_5x5"];
        var { tier, wins, division } = data;
        var isInPromo = data.miniSeriesProgress != "";
        console.log("Obtengo data de jugador");
        this.setState(
          {
            tier,
            wins,
            division,
            isInPromo,
          },
          () => {
            updatePlayerData({ ...this.state });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    // Solicito info de las partidas del jugador
    getMatchlistByPuuid(connection, puuid, summonerId, displayName)
      .then((res) => {
        this.setState(
          {
            matchlist: res,
          },
          () => {
            updatePlayerData({ ...this.state });
          }
        );
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
    const { player, assets, enemy } = this.props;
    const {
      division,
      tier,
      displayName,
      summonerLevel,
      wins,
      isInPromo,
      bestChamps,
      masteryLevels,
      detailModalVisible,
    } = this.state;
    var selectedChamp = this.getChampInfo(this.getSelectedChamp());

    // tags de estadisticas
    var data = {
      ...this.state,
      assignedPosition: player.assignedPosition,
    };
    var tags = [
      ...getTagsFromMatchlist(
        data.matchlist,
        assets,
        selectedChamp,
        player.assignedPosition
      ),
      ...getTagsFromData(data, assets, selectedChamp),
    ];

    var warningLevel = getWarningFromTagList(tags);

    // Tooltip de player
    const playerData = () => {
      return (
        <div className="tooltip">
          {/* Nombre */}
          <div className="tooltip__title">{displayName}</div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="tooltip__tags">
              {tags.map((tag, i) => {
                return (
                  <Tag
                    tooltip={tag.tooltip}
                    value={tag.value}
                    type={tag.type}
                    key={i}
                  />
                );
              })}
            </div>
          )}

          {/* Mejores campeones */}
          {bestChamps && (
            <div className="tooltip__champlist">
              <div className="tooltip__content">Campeones mas jugados</div>
              {bestChamps.map((item) => {
                var champData = this.getChampInfo(item.championId);
                return (
                  <div key={item.championId} className="tooltip__champ">
                    <img src={getSquare(assets.img_links, champData.key)} />
                  </div>
                );
              })}
            </div>
          )}
          {isInPromo && <div className="tooltip__subcontent">En promo</div>}
        </div>
      );
    };

    // Tooltip de mastery
    const masteryData = () => {
      if (!selectedChamp) return "No hay datos de maestria";

      var current_champ_mastery = null;
      if (masteryLevels && selectedChamp) {
        current_champ_mastery = masteryLevels.find(
          (el) => el.championId == parseInt(selectedChamp.championId)
        );
      }

      if (!enemy && !current_champ_mastery) {
        return "No hay datos de maestria";
      }

      var tips = enemy ? selectedChamp.enemyTips : selectedChamp.allyTips;

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

          {/* Consejos */}

          {(enemy || player.isLocalPlayer) && (
            <div className="tips">
              <div className="tips__title">Tips</div>
              {tips.map((tip, i) => {
                // Maximo 2 consejos
                if (i > 1) return null;
                return (
                  <div className="tip" key={i}>
                    - {tip}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    };

    // Decido si pongo un tooltip o no
    const Wrapper = (content) => {
      return !!player.summonerId ? (
        <CustomTooltip placement="left" title={playerData()}>
          {content}
        </CustomTooltip>
      ) : (
        <React.Fragment>{content}</React.Fragment>
      );
    };

    // Spells del jugador
    var player_spells = [];
    var valid_spells = assets.spells.map((spell) => parseInt(spell.key));

    if (selectedChamp) {
      var index1 = valid_spells.indexOf(player.spell1Id);
      var index2 = valid_spells.indexOf(player.spell2Id);
      if (index1 != -1) {
        player_spells.push(assets.spells[index1]);
      }
      if (index2 != -1) {
        player_spells.push(assets.spells[index2]);
      }
    }

    return (
      <div>
        {detailModalVisible && (
          <PlayerDetailModal
            data={data}
            close={this.closeModal.bind(this)}
            selectedChamp={selectedChamp}
          />
        )}
        <div
          className={classnames(`player ${warningLevel}`, {
            "player--enemy": enemy,
          })}
        >
          {/* Tooltip del campeon */}
          <CustomTooltip placement="left" title={masteryData()}>
            <div
              className={classnames("player__image", {
                "player__image--local": player.isLocalPlayer,
              })}
            >
              <img src={imgPlaceholder} alt="" />
              {selectedChamp && (
                <img
                  src={getSquare(assets.img_links, selectedChamp.key)}
                  alt=""
                />
              )}
            </div>
          </CustomTooltip>

          {Wrapper(
            <div className="player__data" onClick={this.openModal.bind(this)}>
              <div className="player__spells">
                {player_spells.map((spell) => {
                  return (
                    <div
                      key={spell.id}
                      className={`player__spells__img fadeIn ${spell.id}`}
                    >
                      <img src={getSpell(assets.img_links, spell.id)} />
                    </div>
                  );
                })}
              </div>
              {/* Nombre */}
              <div
                className={classnames("player__name", {
                  "player__name--nosums":
                    player_spells.length == 0 || !selectedChamp,
                  "player__name--lowop": !displayName && selectedChamp,
                })}
              >
                {displayName || ""}
                {!displayName && selectedChamp ? selectedChamp.name : ""}
                {!!player.assignedPosition && (
                  <small> ({positions_dict[player.assignedPosition]})</small>
                )}
              </div>
              {/* Division */}
              {!!tier && !!division && !!wins && (
                <div className="player__stats">
                  <div className="tier">
                    {tier} {division}
                  </div>
                  <div className="wins">{wins} wins</div>
                </div>
              )}

              {/* Pongo nivel de campeon actual */}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.champSelect,
  connection: selectLcuConnection(state),
  selectPlayer: (summonerId) => selectPlayerBySummonerId(summonerId)(state),
});

const mapDispatchToProps = {
  updatePlayerData,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerItem);
