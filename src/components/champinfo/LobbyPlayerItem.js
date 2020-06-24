import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { getIcon, getSquare } from "../../helpers/getImgLinks";
import classnames from "classnames";
import CustomTooltip from "../utility/CustomTooltip";
import imgPlaceholder from "../../img/placeholder.svg";

export class LobbyPlayerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      division: null,
      tier: null,
      summonerName: null,
      puuid: null,
      summonerId: null,
      summonerLevel: null,
      accountId: null,
      summonerIconId: null,
      wins: null,
      isInPromo: null,
      bestChamps: null,
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
      summonerIconId,
      summonerLevel,
      summonerName,
      puuid,
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
    const { player, isLocalPlayer, assets } = this.props;
    const { summonerId } = player;
    const {
      summonerLevel,
      summonerIconId,
      summonerName,
      bestChamps,
      tier,
      division,
      wins,
      isInPromo,
    } = this.state;

    const playerData = () => {
      return (
        <div className="tooltip">
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
      <div className="player">
        {!!player.summonerId ? (
          <CustomTooltip placement="bottom" title={playerData()}>
            <div className="player__data">
              <div className="player__level">{summonerLevel}</div>
              <div
                className={classnames("player__image", {
                  "player__image--local": isLocalPlayer,
                })}
              >
                <img src={imgPlaceholder} alt="" />
                <img src={getIcon(assets.img_links, summonerIconId)} alt="" />
              </div>
              <div className="player__name">{summonerName || "?"}</div>
            </div>
          </CustomTooltip>
        ) : (
          <div className="player__data">
            <div className="player__level">{summonerLevel}</div>
            <div
              className={classnames("player__image", {
                "player__image--local": isLocalPlayer,
              })}
            >
              <img src={imgPlaceholder} alt="" />
              <img src={getIcon(assets.img_links, summonerIconId)} alt="" />
            </div>
            <div className="player__name">{summonerName || "?"}</div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(LobbyPlayerItem);
