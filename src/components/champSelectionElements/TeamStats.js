import React, { Component } from "react";
import { connect } from "react-redux";
import { Radar, Doughnut } from "react-chartjs-2";
import {
  radarDatasetStylesAvg,
  radarOptions,
  radarDatasetStylesSelected,
  doughnutOptions,
  doughnutDatasetStyles,
} from "../../helpers/chartDefaults";
import classnames from "classnames";
import { getSelectedChampByCellId } from "../../functions/gameSession";

export class TeamStats extends Component {
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

  distToPercentage(dist) {
    var total = dist[0] + dist[1] + dist[2];
    return [
      ((dist[0] * 100) / total).toFixed(2),
      ((dist[1] * 100) / total).toFixed(2),
      ((dist[2] * 100) / total).toFixed(2),
    ];
  }

  render() {
    const { team, assets, enemy, enemyTeam } = this.props;

    // Datos de mi equipo
    var champData = [];
    team.forEach((tmember) => {
      var champ = this.getSelectedChampByCellId(tmember);
      var info = this.getChampInfo(champ);

      if (info) {
        champData.push(info);
      }
    });

    var showDmgDistribution = champData.length > 0;
    var dmgDistribution = [0, 0, 0];
    var alerts = [];

    if (showDmgDistribution) {
      champData.forEach((el) => {
        dmgDistribution[0] += el.damageTypes.physical;
        dmgDistribution[1] += el.damageTypes.magic;
        dmgDistribution[2] += el.damageTypes.true;
      });

      if (!enemy) {
        //   Si hay demasiado de un tipo, lo aviso
        var total = dmgDistribution[0] + dmgDistribution[1];
        var magic_percent = (dmgDistribution[1] * 100) / total;
        var physic_percent = (dmgDistribution[0] * 100) / total;
        if (physic_percent > 65) {
          alerts.push("Tu equipo tiene demasiado AD");
        } else if (magic_percent > 65) {
          alerts.push("Tu equipo tiene demasiado AP");
        }
      }

      dmgDistribution = this.distToPercentage(dmgDistribution);
      var doughnutDataset = {
        datasets: [
          {
            data: [dmgDistribution[0], dmgDistribution[1], dmgDistribution[2]],
            ...doughnutDatasetStyles,
          },
        ],
        labels: ["AD", "AP", "True"],
      };
    }

    // Datos del equipo enemigo
    var unique_team = enemyTeam.length == 0;
    if (!unique_team) {
      var enemyChampData = [];
      enemyTeam.forEach((tmember) => {
        var champ = this.getSelectedChampByCellId(tmember);
        var info = this.getChampInfo(champ);
        if (info) {
          enemyChampData.push(info);
        }
      });

      if (enemyChampData.length > 0) {
        var enemyDmgDistribution = [0, 0, 0];
        enemyChampData.forEach((el) => {
          enemyDmgDistribution[0] += el.damageTypes.physical;
          enemyDmgDistribution[1] += el.damageTypes.magic;
          enemyDmgDistribution[2] += el.damageTypes.true;
        });

        if (!enemy) {
          //   Si hay demasiado de un tipo, lo aviso
          var total = enemyDmgDistribution[0] + enemyDmgDistribution[1];
          var magic_percent = (enemyDmgDistribution[1] * 100) / total;
          var physic_percent = (enemyDmgDistribution[0] * 100) / total;
          if (physic_percent > 65) {
            alerts.push("El equipo enemigo tiene demasiado AD");
          } else if (magic_percent > 65) {
            alerts.push("El equipo enemigo tiene demasiado AP");
          }
        }

        enemyDmgDistribution = this.distToPercentage(enemyDmgDistribution);
      }
    }

    return (
      <div
        className={classnames("teamStats", {
          "teamStats--unique": unique_team,
          "teamStats--enemy": enemy,
          "teamStats--noalerts": alerts.length == 0,
        })}
      >
        {/* Distribucion de dmg */}
        {showDmgDistribution && (
          <div className="fadeIn">
            <div className="row">
              <div
                className={classnames({
                  "col-7": !unique_team,
                  "col-6": unique_team,
                  "col-12": enemy || alerts.length == 0,
                })}
              >
                <div className="graph_data">
                  <div className="title">Distribución de daño</div>
                  <div className="doughnut_container">
                    <Doughnut
                      options={doughnutOptions}
                      data={doughnutDataset}
                    />
                  </div>
                </div>
              </div>
              <div
                className={classnames({
                  "col-5": !unique_team,
                  "col-6": unique_team,
                  "d-none": enemy || alerts.length == 0,
                })}
              >
                <div className="alerts fadeIn">
                  {alerts.length > 0 && <div className="title">Consejos</div>}
                  {alerts.map((alert, i) => {
                    return (
                      <div key={i} className="alert">
                        - {alert}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TeamStats);
