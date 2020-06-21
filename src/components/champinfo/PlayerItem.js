import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { league_connect } from "../../helpers/outsideObjects";
import CustomTooltip from "../utility/CustomTooltip";
import { getSquare, getIcon } from "../../helpers/getImgLinks";
import imgPlaceholder from "../../img/placeholder.svg";
import { getSelectedChampByCellId } from "../../functions/gameSession";

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
      retrys: 0,
      retrysRank: 0,
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

  componentDidUpdate(prevProps) {
    if (
      prevProps.player.summonerId != this.props.player.summonerId &&
      this.props.player.summonerId
    ) {
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
    if (this.state.retrys > 5) {
      return;
    }
    this.setState({
      summonerId,
    });
    console.log(summonerId);

    // Solicito info general del jugador
    league_connect
      .request(
        {
          url: `/lol-summoner/v1/summoners/${summonerId}`,
          method: "GET",
          json: true,
        },
        connection
      )
      .then((res) => {
        res.json().then((res) => {
          console.log(res);
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
              retrys: 0,
            },
            () => {
              this.getPlayerRankData();
            }
          );
        });
      })
      .catch((err) => {
        this.setState({
          retrys: this.state.retrys + 1,
        });
        this.getPlayerInfo();
      });

    //   Info de mejores champs del jugador
    league_connect
      .request(
        {
          url: `/lol-collections/v1/inventories/${summonerId}/champion-mastery/top?limit=3`,
          method: "GET",
          json: true,
        },
        connection
      )
      .then((res) => {
        res.json().then((res) => {
          var bestChamps = res.masteries.map((champ) => {
            const { championId, championPoints } = champ;
            return { championId, championPoints };
          });
          this.setState({ bestChamps, retrys: 0 });
        });
      })
      .catch((err) => {
        this.setState({
          retrys: this.state.retrys + 1,
        });
        this.getPlayerInfo();
      });
  }

  getPlayerRankData() {
    const { connection } = this.props;
    const { puuid, retrysRank } = this.state;
    if (retrysRank > 5) {
      return null;
    }
    // Solicito info de las ranked del jugador
    league_connect
      .request(
        {
          url: `/lol-ranked/v1/ranked-stats?puuids=["${puuid}"]`,
          method: "GET",
          json: true,
        },
        connection
      )
      .then((res) => {
        res.json().then((res) => {
          var key = puuid || Object.keys(res)[0];
          var data = res[key].queueMap["RANKED_SOLO_5x5"];
          var { tier, wins, division } = data;
          var isInPromo = data.miniSeriesProgress != "";
          this.setState({
            tier,
            wins,
            division,
            isInPromo,
            retrysRank: 0,
          });
        });
      })
      .catch((err) => {
        this.setState({ retrysRank: this.state.retrysRank + 1 });
      });
  }

  render() {
    const { player, assets } = this.props;
    const {
      division,
      tier,
      displayName,
      summonerLevel,
      wins,
      isInPromo,
      bestChamps,
      profileIconId,
    } = this.state;
    var selectedChamp = this.getChampInfo(this.getSelectedChamp());

    const playerData = () => {
      return (
        <div className="tooltip">
          <div className="tooltip__title">{displayName}</div>
          {summonerLevel && (
            <div className="tooltip__content">
              Nivel: <div className="value">{summonerLevel}</div>
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
      <div className="player">
        <div className="player__data">
          {!!player.assignedPosition && (
            <div className="player__lane">
              {positions_dict[player.assignedPosition]}
            </div>
          )}
          {!!player.summonerId ? (
            <CustomTooltip placement="top" title={playerData()}>
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
          <div className="player__name">{displayName || "?"}</div>
        </div>
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
