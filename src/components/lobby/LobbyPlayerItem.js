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

import {
  selectChampionsAsDict,
  selectImgLinks,
} from "../../redux/assets/assets.selectors";

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
    };
  }

  componentDidMount() {
    if (this.props.player.summonerId) {
      this.getPlayerInfo();
    }
  }

  getPlayerInfo() {
    const { player, connection, selectPlayer, updatePlayerData } = this.props;
    const {
      summonerId,
      summonerIconId,
      summonerLevel,
      summonerName,
      puuid,
      displayName,
    } = player;

    this.setState({
      summonerId,
      summonerLevel,
      puuid,
      displayName: displayName || summonerName,
      profileIconId: summonerIconId,
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

    // Pido info de las maestrias
    getSummonerMasteriesById(connection, puuid)
      .then((res) => {
        // Ordeno descendentemente por maestria
        res = res.sort((a, b) => b.championPoints - a.championPoints);
        this.setState(
          {
            masteryLevels: res,
            // best champs are the first 3
            bestChamps: res.slice(0, 3),
          },
          () => {
            updatePlayerData({ ...this.state });
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    // Solicito info de las ranked del jugador
    getPlayerRankedData(connection, puuid)
      .then((res) => {
        var data = res.queueMap["RANKED_SOLO_5x5"];
        var { tier, wins, division } = data;
        var isInPromo = data.miniSeriesProgress != "";
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
    getMatchlistByPuuid(connection, puuid, summonerId, summonerName)
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
    const {
      player,
      isLocalPlayer,
      assets,
      multiTeams,
      championDict,
      imgLinks,
    } = this.props;
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
      masteryLevels,
    } = this.state;

    var tags = [
      ...getTagsFromMatchlist(this.state.matchlist, assets, null),
      ...getTagsFromData(this.state, assets, null),
    ];

    console.log(this.state);

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
                var champData = championDict[item.championId];
                return (
                  <div key={item.championId} className="tooltip__champ">
                    <img src={getSquare(imgLinks, champData.key)} />
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
                  <img src={getIcon(imgLinks, profileIconId)} alt="" />
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
                <img src={getIcon(imgLinks, profileIconId)} alt="" />
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
  connection: selectLcuConnection(state),
  imgLinks: selectImgLinks(state),
  championDict: selectChampionsAsDict(state),
  selectPlayer: (summonerId) => selectPlayerBySummonerId(summonerId)(state),
});

const mapDispatchToProps = {
  updatePlayerData,
};

export default connect(mapStateToProps, mapDispatchToProps)(LobbyPlayerItem);
