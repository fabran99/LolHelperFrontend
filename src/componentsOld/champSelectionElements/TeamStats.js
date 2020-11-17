import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import {
  getSelectedChampByCellId,
  gameHasBans,
  getSelectedChamp,
  isBaning,
  getMyTeamBans,
} from "../../functions/gameSession";
import { getSquare } from "../../helpers/getImgLinks";
import { damageDistToPercentage, getWinrate } from "../../helpers/general";
import DamageDistributionBar from "../utility/DamageDistributionBar";
import CustomTooltip from "../utility/CustomTooltip";

export class TeamStats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bestBans: null,
    };
  }

  componentDidMount() {
    const { enemy, gameSession, champSelect } = this.props;
    if (gameHasBans(gameSession) && !enemy && isBaning(champSelect)) {
      this.setInitialBans();
    }
  }

  componentDidUpdate(prevProps) {
    const { enemy, gameSession, champSelect } = this.props;
    if (
      gameHasBans(gameSession) &&
      !enemy &&
      isBaning(champSelect) &&
      !isBaning(prevProps.champSelect)
    ) {
      this.setInitialBans();
    }
  }

  // Bans generales
  setInitialBans() {
    const { assets } = this.props;

    // Primero pongo el personaje con mayor banrate
    var mostBanrate = assets.champions.sort((a, b) => b.banRate - a.banRate)[0];

    // El personaje con mayor winrate
    var mostWinrate = assets.champions.sort((a, b) => {
      var aWin = getWinrate(a);
      var bWin = getWinrate(b);
      return bWin - aWin;
    });
    mostWinrate = mostWinrate.find((el) => el.key != mostBanrate.key);
    var bestBans = [
      {
        championId: parseInt(mostBanrate.championId),
        reason: `Mayor banrate en la actualidad (${mostBanrate.banRate}%)`,
      },
      {
        championId: parseInt(mostWinrate.championId),
        reason: `Mayor winrate en la actualidad (${getWinrate(mostWinrate)}%)`,
      },
    ];

    this.setState({ bestBans });
  }

  // Datos de campeon
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  getSelectedChampByCellId(player) {
    const { champSelect } = this.props;
    return getSelectedChampByCellId(champSelect, player.cellId);
  }

  //  Estadisticas
  getDmgDistribution(team) {
    var champData = [];
    team.forEach((tmember) => {
      var champ = this.getSelectedChampByCellId(tmember);
      var info = this.getChampInfo(champ);

      if (info) {
        champData.push(info);
      }
    });

    var showDmgDistribution = champData.length > 0;
    var dmgDistribution = [0, 0];

    if (showDmgDistribution) {
      champData.forEach((el) => {
        dmgDistribution[0] += el.damageTypes.physical;
        dmgDistribution[1] += el.damageTypes.magic;
      });

      return damageDistToPercentage(dmgDistribution);
    } else {
      return null;
    }
  }

  calculateAlerts() {
    const { team, enemy, enemyTeam } = this.props;
    var alerts = [];

    if (enemy) {
      return alerts;
    }

    // Distribucion de daño aliado
    var dmgDistribution = this.getDmgDistribution(team);
    if (dmgDistribution) {
      //   Si hay demasiado de un tipo, lo aviso
      var magic_percent = dmgDistribution[1];
      var physic_percent = dmgDistribution[0];
      if (physic_percent > 70) {
        alerts.push({
          text: "Tu equipo tiene demasiado AD",
          tooltip:
            "Intenta balancear el daño del equipo pickeando personajes AP o armando builds híbridas con los personajes que sea efectivo.",
        });
      } else if (magic_percent > 70) {
        alerts.push({
          text: "Tu equipo tiene demasiado AP",
          tooltip:
            "Intenta balancear el daño del equipo pickeando personajes AD o armando builds híbridas con los personajes que sea efectivo.",
        });
      }
    }

    // Distribucion de daño del enemigo
    var unique_team = enemyTeam.length == 0;
    if (!unique_team) {
      var enemyDmgDistribution = this.getDmgDistribution(enemyTeam);

      if (enemyDmgDistribution) {
        //   Si hay demasiado de un tipo, lo aviso
        var magic_percent = enemyDmgDistribution[1];
        var physic_percent = enemyDmgDistribution[0];
        if (physic_percent > 70) {
          alerts.push({
            tooltip:
              "Intenta pickear tanques efectivos contra AD como RAMMUS o MALPHITE, u objetos de armadura",
            text: "El equipo enemigo tiene demasiado AD",
          });
        } else if (magic_percent > 70) {
          alerts.push({
            text: "El equipo enemigo tiene demasiado AP",
            tooltip:
              "Intenta pickear tanques efectivos contra AP como GALIO, u objetos de resistencia mágica",
          });
        }
      }
    }

    return alerts;
  }

  calculateBestBans() {
    const { team, champSelect } = this.props;
    const { bestBans } = this.state;

    var bans = [];
    // Busco si hay un campeon actualmente señalado
    var currentChamp = getSelectedChamp(champSelect);
    if (currentChamp) {
      // Busco el campeon con mas winrate en contra
      var champData = this.getChampInfo(currentChamp);
      var hardEnemy = champData.weakAgainst[0];
      if (champData && hardEnemy.winRate < 50) {
        var enemyChamp = this.getChampInfo(hardEnemy.championId);
        if (enemyChamp) {
          // var positionInBestBans = bestBans.map((el)=>el.championId).indexOf(parseInt(hardEnemy.championId))
          // if(positionInBestBans != -1){
          //   bans[positionInBestBans].reason+=`\n `
          // }
          bans.push({
            championId: parseInt(hardEnemy.championId),
            reason: `${
              champData.name
            } suele ganar solo un ${hardEnemy.winRate.toFixed(
              2
            )}% de las partidas contra ${enemyChamp.name}`,
          });
        }
      }
    }

    // Busco campeones que suelan hacerle counter a tu team
    var teamCounters = {};
    var teamChamps = [];
    team.forEach((player) => {
      var champ = this.getSelectedChampByCellId(player);

      if (champ) {
        let champData = this.getChampInfo(champ);

        if (champData) {
          teamChamps.push(parseInt(champData.championId));
          champData.weakAgainst.forEach((strongEnemy) => {
            if (strongEnemy.championId in teamCounters) {
              teamCounters[strongEnemy.championId] += 1;
            } else {
              teamCounters[strongEnemy.championId] = 1;
            }
          });
        }
      }
    });

    // Entre todos los counters reviso el mayor de todos
    var myTeamBans = getMyTeamBans(champSelect).map((el) => parseInt(el));
    var avoidChamps = [...myTeamBans, ...teamChamps];

    if (bestBans) {
      avoidChamps = [...avoidChamps, ...bestBans.map((el) => el.championId)];
    }
    if (Object.keys(teamCounters).length > 0) {
      var worstEnemy = Object.keys(teamCounters)[0];
      for (let champ in teamCounters) {
        if (
          teamCounters[champ] > teamCounters[worstEnemy] &&
          avoidChamps.indexOf(parseInt(champ)) == -1
        ) {
          worstEnemy = champ;
        }
      }
      if (teamCounters[worstEnemy] > 1) {
        // Busco el que tiene mas winrate de todos los que tengan esa cantidad
        var bestWinrate = 0;
        var quantity = teamCounters[worstEnemy];
        Object.entries(teamCounters).forEach((counter) => {
          if (
            counter[1] != quantity ||
            avoidChamps.indexOf(parseInt(counter[0])) != -1
          ) {
            return;
          }

          let champData = this.getChampInfo(counter[0]);
          if (champData) {
            let winrate = getWinrate(champData);
            if (winrate > bestWinrate) {
              bestWinrate = winrate;
              worstEnemy = counter[0];
            }
          }
        });

        let champData = this.getChampInfo(worstEnemy);
        bans.push({
          championId: parseInt(worstEnemy),
          reason: `${champData.name} da problemas a al menos ${teamCounters[worstEnemy]} personajes del equipo`,
        });
      }
    }

    var finalBans = [...bans];
    if (bestBans) {
      finalBans = [...finalBans, ...bestBans];
    }

    return finalBans;
  }

  render() {
    const {
      team,
      assets,
      enemy,
      enemyTeam,
      gameSession,
      champSelect,
    } = this.props;

    // Distribucion de daño
    var dmgDistribution = this.getDmgDistribution(team);
    var unique_team = enemyTeam.length == 0;

    // Alertas
    var alerts = this.calculateAlerts();

    // Recomendaciones de bans
    var recommendedBans = null;
    if (gameHasBans(gameSession) && !enemy && isBaning(champSelect)) {
      recommendedBans = this.calculateBestBans();
    }

    return (
      <div
        className={classnames("teamStats", {
          "teamStats--unique": unique_team,
          "teamStats--enemy": enemy,
          "teamStats--noalerts": alerts.length == 0,
        })}
      >
        {/* Consejos y datos */}
        <div className="fadeIn">
          <div className="row">
            <div
              className={classnames({
                "col-7": !unique_team,
                "col-6": unique_team,
                "col-12": enemy,
              })}
            >
              {/* Distribucion de dmg */}

              {dmgDistribution && (
                <div className="graph_data">
                  <div className="title">Distribución de daño</div>
                  <DamageDistributionBar
                    ap={dmgDistribution[1]}
                    ad={dmgDistribution[0]}
                  />
                </div>
              )}
              {recommendedBans && recommendedBans.length > 0 && (
                <div className="recommended_bans">
                  <div className="title">Bans recomendados</div>
                  <div className="recommended_bans_container">
                    {recommendedBans.map((ban, i) => {
                      let champData = this.getChampInfo(ban.championId);
                      if (!champData) {
                        return null;
                      }
                      return (
                        <CustomTooltip
                          key={ban.championId}
                          title={ban.reason}
                          placement="top"
                        >
                          <div className="recommended_bans__item">
                            <div className="recommended_bans__image">
                              <img
                                src={getSquare(assets.img_links, champData.key)}
                              />
                            </div>
                          </div>
                        </CustomTooltip>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div
              className={classnames({
                "col-5": !unique_team,
                "col-6": unique_team,
                "d-none": enemy,
              })}
            >
              <div className="alerts fadeIn">
                <div className="title">Consejos</div>
                {alerts.map((alert, i) => {
                  return (
                    <CustomTooltip
                      key={i}
                      placement="top"
                      title={
                        <div className="tooltip">
                          <div className="tooltip__title">Consejo</div>
                          <div className="tooltip__content">
                            {alert.tooltip}
                          </div>
                        </div>
                      }
                    >
                      <div className="alert">- {alert.text}</div>
                    </CustomTooltip>
                  );
                })}
                {(!alerts || alerts.length == 0) && (
                  <div className="alert alert--empty">
                    No hay consejos disponibles
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
  gameSession: state.lcuConnector.gameSession,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TeamStats);
