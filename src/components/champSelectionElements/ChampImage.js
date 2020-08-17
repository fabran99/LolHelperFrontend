import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoading, getSquare, getSpell } from "../../helpers/getImgLinks";
import { spellsFromChamp } from "../../functions/assetParser";
import CustomTooltip from "../utility/CustomTooltip";
import { getCurrentPlayer } from "../../functions/gameSession";
import RuneList from "./RuneList";
import ItemList from "./ItemList";
import CountersList from "./CountersList";
import ListStat from "../lists/ListStat";
import imgPlaceholder from "../../img/placeholder.svg";
import { electron } from "../../helpers/outsideObjects";
import { updateConfig } from "../../actions/configActions";
import {
  radarDatasetStylesAvg,
  radarOptions,
  radarDatasetStylesSelected,
  doughnutOptions,
  doughnutDatasetStyles,
} from "../../helpers/chartDefaults";
import classnames from "classnames";

import { Radar, Doughnut } from "react-chartjs-2";

export class ChampImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleData: "runes",
      runesApplied: false,
      runeButtonDisabled: false,
    };
  }

  // Runas
  applyRunes() {
    var { champ } = this.props;
    if (
      !champ ||
      this.state.runeButtonDisabled ||
      this.props.configuration.changingRunes
    ) {
      return;
    }
    this.setState(
      {
        runeButtonDisabled: true,
      },
      () => {
        var obj = {
          runePage: champ.runes,
          champName: champ.name,
          connection: this.props.connection,
        };
        electron.ipcRenderer
          .invoke("CHANGE_RUNES", JSON.stringify(obj))
          .then((res) => {
            this.setState({
              runeButtonDisabled: false,
              runesApplied: true,
            });
          })
          .catch((err) => {
            this.setState({
              runeButtonDisabled: false,
              runesApplied: false,
            });
          });
      }
    );
  }

  toggleAutoImport() {
    this.props.updateConfig({
      dontAutoImportRunesNow: !this.props.configuration.dontAutoImportRunesNow,
    });
  }

  // General
  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  getCurrentPlayer() {
    const { champSelect } = this.props;
    return getCurrentPlayer(champSelect);
  }

  // estadisticas
  getRadarAvg() {
    const { assets } = this.props;
    const radarStats = ["kills", "deaths", "assists", "farmPerMin", "damage"];

    var stats = assets.radar_stats.find((x) => x.elo == "high_elo");

    var maxRadar = radarStats.map((stat) => {
      return stats[stat].max;
    });

    var avgRadar = radarStats.map((stat, i) => {
      return Math.round((stats[stat].mean * 100) / maxRadar[i]);
    });
    return avgRadar;
  }

  getStatsAspercent(champ) {
    const { assets, configuration } = this.props;
    const radarStats = ["kills", "deaths", "assists", "farmPerMin", "damage"];

    var stats = assets.radar_stats.find((x) => x.elo == "high_elo");
    var maxRadar = radarStats.map((stat) => {
      return stats[stat].max;
    });

    var asPercent = radarStats.map((stat, i) => {
      var max = maxRadar[i];
      return (champ[stat] * 100) / max;
    });
    return asPercent;
  }

  render() {
    const { champ, assets, configuration } = this.props;
    const { visibleData } = this.state;

    // Si no tengo un champ seleccionado retorno una vista default
    if (!champ) {
      return (
        <div>
          <div className="detailcard">
            <div className="detailcard__background">
              <img
                className="detailcard__placeholder"
                src={imgPlaceholder}
                alt=""
              />
            </div>
          </div>
        </div>
      );
    }

    // Estadisticas
    var charts_states = ["champanalytics", "damagedistribution"];
    if (charts_states.indexOf(visibleData) != -1) {
      const radarLabels = ["Kills", "Deaths", "Assists", "CS/Min", "Damage"];

      var radarDatasets = [
        {
          data: this.getRadarAvg(),
          label: "Promedio",
          ...radarDatasetStylesAvg,
        },
        {
          data: this.getStatsAspercent(champ),
          label: "Campeón actual",
          ...radarDatasetStylesSelected,
        },
      ];

      var doughnutDataset = {
        datasets: [
          {
            data: [
              champ.damageTypes.physical,
              champ.damageTypes.magic,
              champ.damageTypes.true,
            ],
            ...doughnutDatasetStyles,
          },
        ],
        labels: ["AD", "AP", "True"],
      };

      var radarData = {
        labels: radarLabels,
        datasets: radarDatasets,
      };

      var optionsRadar = {
        ...radarOptions,
        legend: {
          display: false,
        },
      };
    }

    // Runas
    var noAutoRunes = configuration.dontAutoImportRunesNow;
    var { autoImportRunes } = configuration;
    const { runeButtonDisabled } = this.state;

    const runeButtonContent = () => {
      if (runeButtonDisabled || configuration.changingRunes) {
        return "Aplicando runas...";
      } else if (!autoImportRunes) {
        return "Click para importar runas";
      } else if (autoImportRunes && noAutoRunes) {
        return "Auto importación desactivada, click para reactivar";
      } else {
        return "Auto importación activa, click para desactivar";
      }
    };

    const runeButtonAction = () => {
      if (!autoImportRunes) {
        return this.applyRunes.bind(this);
      } else {
        return this.toggleAutoImport.bind(this);
      }
    };

    return (
      <div>
        <div className="detailcard detailcard--visible">
          <div className="detailcard__border"></div>
          <div className="detailcard__background">
            <img src={getLoading(assets.img_links, champ.key)} alt="" />
          </div>
          <div className="detailcard__overlay"></div>

          <div className="detailcard__text">
            <div className="name">{champ.name}</div>
            <div className="title">{champ.title}</div>
            <div className="summoners">
              {spellsFromChamp(champ, assets).map((spell, i) => {
                return (
                  <CustomTooltip
                    key={spell.id}
                    placement="top"
                    title={
                      <div className="tooltip">
                        <div className="tooltip__title">{spell.name}</div>
                        <div className="tooltip__content">
                          {spell.description}
                        </div>
                        <div className="tooltip__subcontent">
                          Cooldown: {spell.cooldown}s
                        </div>
                      </div>
                    }
                  >
                    <div className="spell">
                      <div className="image">
                        <img src={getSpell(assets.img_links, spell.id)} />
                      </div>
                    </div>
                  </CustomTooltip>
                );
              })}
            </div>
          </div>
          {/* Runas */}
          <CustomTooltip title={runeButtonContent()} placement="top">
            <div
              onClick={runeButtonAction()}
              className={classnames("runehandler", {
                disabled: runeButtonDisabled || configuration.changingRunes,
              })}
            >
              <div className="runehandler__border"></div>
              {autoImportRunes && noAutoRunes && (
                <span>
                  AutoImport <i className="fas fa-ban"></i>
                </span>
              )}
              {autoImportRunes && !noAutoRunes && (
                <span>
                  AutoImport <i className="fas fa-check-circle"></i>
                </span>
              )}
              {!autoImportRunes && <span>Importar runas</span>}
            </div>
          </CustomTooltip>
        </div>
        {/* Toggle de opciones de campeon */}
        <div className="champImageExtraData">
          <div className="champImageExtraData__select">
            <select
              name="visibleData"
              value={visibleData}
              onChange={this.handleInput.bind(this)}
            >
              <option value="runes">Runas</option>
              <option value="build">Build</option>
              <option value="counters">Counters</option>
              <option value="champstats">Estadísticas del campeón</option>
              <option value="champanalytics">Análisis del campeón</option>
              <option value="damagedistribution">Distribución de daño</option>
            </select>
          </div>
          {/* Runas */}
          {visibleData == "runes" && (
            <div className="fadeIn">
              <RuneList champ={champ} />
            </div>
          )}
          {/* Counters */}
          {visibleData == "counters" && (
            <div className="fadeIn">
              <CountersList champ={champ} />
            </div>
          )}
          {/* items */}
          {visibleData == "build" && (
            <div className="fadeIn">
              <ItemList champ={champ} />
            </div>
          )}
          {/* Winrate, banrate pickrate */}
          {visibleData == "champstats" && (
            <div className="fadeIn">
              <div className="stats">
                <ListStat value={champ.winRate} title={"Winrate"} />
                <ListStat
                  value={champ.banRate}
                  title={"Banrate"}
                  color="pink"
                />
                <ListStat
                  value={champ.pickRate}
                  title={"Pickrate"}
                  color="green"
                />
              </div>
            </div>
          )}

          {/* Analytics */}
          {visibleData == "champanalytics" && (
            <div className="fadeIn">
              <div className="chart_container">
                <div className="radar_container">
                  <Radar data={radarData} options={optionsRadar} />
                </div>
              </div>
            </div>
          )}
          {/* damage distribution */}
          {visibleData == "damagedistribution" && (
            <div className="fadeIn">
              <div className="chart_container">
                <div className="doughnut_container">
                  <Doughnut options={doughnutOptions} data={doughnutDataset} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
  configuration: state.configuration,
});

export default connect(mapStateToProps, { updateConfig })(ChampImage);
