import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import CustomTooltip from "../utility/CustomTooltip";
import { getSquare, getSpell } from "../../helpers/getImgLinks";
import imgPlaceholder from "../../img/placeholder.svg";
import { getSelectedChampByCellId } from "../../functions/gameSession";
import { electron } from "../../helpers/outsideObjects";
import moment from "moment";
import { numberToDots } from "../../helpers/general";

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
    const { puuid } = this.state;

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
      profileIconId,
      masteryLevels,
    } = this.state;
    var selectedChamp = this.getChampInfo(this.getSelectedChamp());

    const playerData = () => {
      return (
        <div className="tooltip">
          {/* Nombre */}
          <div className="tooltip__title">{displayName}</div>
          {/* Nivel */}
          {summonerLevel && (
            <div className="tooltip__content">
              Nivel: <div className="value">{summonerLevel}</div>
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

    const masteryData = () => {
      var current_champ_mastery = null;
      if (masteryLevels && selectedChamp) {
        current_champ_mastery = masteryLevels.find(
          (el) => el.championId == parseInt(selectedChamp.championId)
        );
      }

      if (current_champ_mastery) {
        return (
          <div className="tooltip">
            <div className="tooltip__title">
              {displayName} <small>({selectedChamp.name})</small>
            </div>
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
                      <div className="value  d-inline">
                        {current_champ_mastery.championLevel}
                      </div>
                    </div>
                    <div>
                      Jugado por última vez:{" "}
                      <div className="value">
                        {moment
                          .unix(current_champ_mastery.lastPlayTime / 1000)
                          .format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return "No hay datos de maestria ";
      }
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
      <div
        className={classnames("player", {
          "player--enemy": enemy,
        })}
      >
        {!!player.summonerId ? (
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
        ) : (
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
        )}

        {Wrapper(
          <div className="player__data">
            <div className="player__spells">
              {player_spells.map((spell) => {
                return (
                  <div key={spell.id} className="player__spells__img fadeIn">
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
                <div className="wins">{wins} wins (Ranked)</div>
              </div>
            )}

            {/* Pongo nivel de campeon actual */}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
  connection: state.lcuConnector.connection,
});

export default connect(mapStateToProps, null)(PlayerItem);
