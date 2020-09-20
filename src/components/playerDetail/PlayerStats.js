import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import classnames from "classnames";

import { getSquare } from "../../helpers/getImgLinks";
import { getLaneFromRole, numberToDots } from "../../helpers/general";
import CustomTooltip from "../utility/CustomTooltip";
import LaneRateStat from "../utility/LaneRateStat";
import MiniLoader from "../utility/MiniLoader";

const LANES = ["Mid", "Jungla", "ADC", "Support", "Top"];

export class PlayerStats extends Component {
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  render() {
    const { stats, assets, masteryLevels } = this.props;

    if (!stats) {
      return <MiniLoader />;
    }

    return (
      <div>
        {/* Jugados recientemente */}
        <div className="section_title t-center">Jugados recientemente</div>
        <div className="match_stats">
          <div className="match_stats__champ_list">
            {stats.mostPlayedChamps.map((champ) => {
              var champData = this.getChampInfo(champ.championId);

              var champMastery = null;

              if (masteryLevels) {
                champMastery = masteryLevels.find(
                  (el) => el.championId == parseInt(champData.championId)
                );
              }

              return (
                <CustomTooltip
                  key={champ.championId}
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{champData.name}</div>
                      <div className="tooltip__content">
                        WinRate: <div className="value">{champ.winrate} %</div>
                      </div>
                      {champMastery && (
                        <div className="tooltip__content">
                          Puntos de maestría:{" "}
                          <div className="value">
                            {numberToDots(champMastery.championPoints)}
                          </div>
                        </div>
                      )}
                      {champMastery && (
                        <div className="tooltip__content">
                          Jugado por última vez:{" "}
                          <div className="value">
                            {moment
                              .unix(champMastery.lastPlayTime / 1000)
                              .format("DD/MM/YYYY HH:mm")}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  placement="top"
                >
                  <div className="champ_item">
                    <div className="champ_image_container">
                      <img src={getSquare(assets.img_links, champData.key)} />
                    </div>
                    <div className="champ_item__value">{champ.playrate} %</div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>

        <div className="section_subtitle t-center">% de partidas jugadas</div>

        {/* Mejor winrate por champ */}
        <div className="section_title t-center">Mejor desempeño reciente</div>
        <div className="match_stats">
          <div className="match_stats__champ_list">
            {stats.bestWinrateChamps.map((champ) => {
              var champData = this.getChampInfo(champ.championId);

              var champMastery = null;

              if (masteryLevels) {
                champMastery = masteryLevels.find(
                  (el) => el.championId == parseInt(champData.championId)
                );
              }

              return (
                <CustomTooltip
                  key={champ.championId}
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title">{champData.name}</div>
                      <div className="tooltip__content">
                        Partidas jugadas:{" "}
                        <div className="value">{champ.timesPlayed}</div>
                      </div>
                      {champMastery && (
                        <div className="tooltip__content">
                          Puntos de maestría:{" "}
                          <div className="value">
                            {numberToDots(champMastery.championPoints)}
                          </div>
                        </div>
                      )}
                      {champMastery && (
                        <div className="tooltip__content">
                          Jugado por última vez:{" "}
                          <div className="value">
                            {moment
                              .unix(champMastery.lastPlayTime / 1000)
                              .format("DD/MM/YYYY HH:mm")}
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  placement="top"
                >
                  <div className="champ_item">
                    <div className="champ_image_container">
                      <img src={getSquare(assets.img_links, champData.key)} />
                    </div>
                    <div className="champ_item__value">{champ.winrate} %</div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>

        <div className="section_subtitle t-center">% de victorias</div>

        {/* Distribucion por linea */}
        <div className="section_title t-center">
          Actividad reciente por línea
        </div>
        <div className="match_distributions">
          {LANES.map((lane, i) => {
            let laneWinrate = stats.laneWinrateDistribution[lane] || 0;
            let lanePlay = stats.lanePlayDistribution[lane] || 0;

            return (
              <LaneRateStat
                key={lane}
                height={lanePlay}
                lane={lane}
                laneWinrate={laneWinrate}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerStats);
