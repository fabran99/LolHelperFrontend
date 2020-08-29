import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { getIcon, getSquare } from "../../helpers/getImgLinks";
import classnames from "classnames";
import CustomTooltip from "../utility/CustomTooltip";
import Tag from "../utility/Tag";
import { getTagsFromMatchlist, getTagsFromData } from "../../helpers/general";
import imgPlaceholder from "../../img/placeholder.svg";
import PlayerDetailModal from "../playerDetail/PlayerDetailModal";

export class LobbyPlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      division: null,
      tier: null,
      puuid: null,
      summonerId: null,
      summonerLevel: null,
      accountId: null,
      wins: null,
      isInPromo: null,
      bestChamps: null,
      displayName: null,
      profileIconId: null,
      masteryLevels: null,
      matchlist: null,
      detailModalVisible: false,
      displayName: null,
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

  getPlayerInfo() {
    const { player, connection } = this.props;
    const {
      summonerId,
      summonerIconId,
      summonerLevel,
      summonerName,
      puuid,
    } = player;

    this.setState({
      summonerId,
      summonerLevel,
      puuid,
      displayName: summonerName,
      profileIconId: summonerIconId,
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
      .invoke("GET_MATCHLIST_BY_PUUID", JSON.stringify({ connection, puuid }))
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
    const { player, isLocalPlayer, assets, multiTeams } = this.props;
    const { summonerId } = player;
    const {
      summonerLevel,
      profileIconId,
      displayName,
      bestChamps,
      tier,
      division,
      wins,
      isInPromo,
      detailModalVisible,
    } = this.state;

    var tags = [
      ...getTagsFromMatchlist(this.state.matchlist, assets, null),
      ...getTagsFromData(this.state, assets, null),
    ];

    const playerData = () => {
      return (
        <div className="tooltip">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="tooltip__tags mt-0">
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

          {!!tier && !!division && !!wins && (
            <div className="tooltip__content">
              Division:{" "}
              <div className="value">
                {tier} {division} ({wins} wins)
              </div>
            </div>
          )}
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

    return (
      <React.Fragment>
        {detailModalVisible && (
          <PlayerDetailModal
            data={this.state}
            close={this.closeModal.bind(this)}
          />
        )}
        <div
          className={classnames("player", {
            "player--multiteam": multiTeams,
          })}
          onClick={this.openModal.bind(this)}
        >
          {!!player.summonerId ? (
            <CustomTooltip placement="top" title={playerData()}>
              <div
                className={classnames("player__data", {
                  "player__data--local": isLocalPlayer,
                })}
              >
                <div className="player__level">{summonerLevel}</div>
                <div
                  className={classnames("player__image", {
                    "player__image--local": isLocalPlayer,
                  })}
                >
                  <img src={imgPlaceholder} alt="" />
                  <img src={getIcon(assets.img_links, profileIconId)} alt="" />
                </div>
                <div className="player__name">{displayName || "?"}</div>
              </div>
            </CustomTooltip>
          ) : (
            <div
              className={classnames("player__data", {
                "player__data--local": isLocalPlayer,
              })}
            >
              <div className="player__level">{summonerLevel}</div>
              <div
                className={classnames("player__image", {
                  "player__image--local": isLocalPlayer,
                })}
              >
                <img src={imgPlaceholder} alt="" />
                <img src={getIcon(assets.img_links, profileIconId)} alt="" />
              </div>
              <div className="player__name">{displayName || "?"}</div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(LobbyPlayerItem);
