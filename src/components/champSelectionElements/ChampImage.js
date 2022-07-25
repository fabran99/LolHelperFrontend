import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoading, getSpell } from "../../helpers/getImgLinks";
import { spellsFromChamp } from "../../functions/assetParser";
import CustomTooltip from "../utility/CustomTooltip";
import { getCurrentPlayer } from "../../functions/gameSession";
import { parseBuild } from "../../functions/buildLists";
import RuneList from "../champExtraElements/RuneList";
import Phases from "../champExtraElements/Phases";
import ItemList from "../champExtraElements/ItemList";
import SkillOrder from "../champExtraElements/SkillOrder";
import CountersList from "../champExtraElements/CountersList";
import imgPlaceholder from "../../img/placeholder.svg";
import { electron } from "../../helpers/outsideObjects";
import { updateConfig } from "../../redux/settings/settings.actions";
import classnames from "classnames";
import RadarStats from "../champExtraElements/RadarStats";
import DoughnutStats from "../champExtraElements/DoughnutStats";
import WinBanPickrate from "../champExtraElements/WinBanPickrate";

export class ChampImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      runesApplied: false,
      runeButtonDisabled: false,
      buildApplied: false,
      buildButtonDisabled: false,
    };
  }

  // Runas
  applyRunes() {
    var { champ, settings } = this.props;
    if (!champ || this.state.runeButtonDisabled || settings.changingRunes) {
      return;
    }
    this.setState(
      {
        runeButtonDisabled: true,
      },
      () => {
        var lane = settings.laneSelectedForRecommendations;

        if (!lane || champ.lanes.indexOf(lane) == -1) {
          lane = champ.lanes[0];
        }

        var runes = champ.info_by_lane.find((item) => item.lane == lane).runes;
        var obj = {
          runePage: runes,
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

  toggleAutoImportRunes() {
    this.props.updateConfig({
      dontAutoImportRunesNow: !this.props.settings.dontAutoImportRunesNow,
    });
  }

  // Objetos
  toggleAutoImportBuild() {
    this.props.updateConfig({
      dontAutoImportBuildNow: !this.props.settings.dontAutoImportBuildNow,
    });
  }

  applyBuild() {
    var { champ, updateConfig, settings } = this.props;
    if (!champ || this.state.buildButtonDisabled || settings.savingBuild) {
      return;
    }
    this.setState(
      {
        buildButtonDisabled: true,
      },
      () => {
        var buildObject = parseBuild(champ);
        updateConfig({
          savingBuild: true,
        });

        electron.ipcRenderer.invoke(
          "IMPORT_ITEMS",
          JSON.stringify(buildObject)
        );
      }
    );
  }

  componentDidUpdate(prevProps) {
    // Actualizo la linea actual
    if (
      (!prevProps.champ && this.props.champ) ||
      (this.props.champ &&
        prevProps.champ &&
        prevProps.champ.key != this.props.champ.key)
    ) {
      this.defaultToFirstLaneOrKeep();
    }

    // Muestro cambios en la interfaz si aplico la build
    if (prevProps.settings.savingBuild && !this.props.settings.savingBuild) {
      this.timeoutApplyBuild = setTimeout(() => {
        this.setState({
          buildButtonDisabled: false,
          buildApplied: true,
        });
      }, 200);
    }
  }

  componentWillUnmount() {
    if (this.timeoutApplyBuild) {
      clearTimeout(this.timeoutApplyBuild);
    }
  }

  // Manejo de lineas
  componentDidMount() {
    this.defaultToFirstLaneOrKeep();
  }

  defaultToFirstLaneOrKeep() {
    // Mantengo la linea seleccionada o pongo la primera si cambio de personaje
    const { champ, settings, updateConfig } = this.props;
    var currentLane = settings.laneSelectedForRecommendations;
    if (champ) {
      var lanes = champ.lanes;
      if (lanes.indexOf(currentLane) == -1) {
        updateConfig({ laneSelectedForRecommendations: lanes[0] });
      }
    }
  }

  // General
  handleInput(e) {
    const { updateConfig } = this.props;
    updateConfig({
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

  render() {
    const { champ, assets, settings } = this.props;
    const {
      champSelectionVisibleData: visibleData,
      savingBuild,
      laneSelectedForRecommendations: lane,
    } = settings;
    const { runeButtonDisabled, buildButtonDisabled } = this.state;

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

    // Runas
    var noAutoRunes = settings.dontAutoImportRunesNow;
    var { autoImportRunes, autoImportBuild } = settings;

    const runeButtonContent = () => {
      if (runeButtonDisabled || settings.changingRunes) {
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
        return this.toggleAutoImportRunes.bind(this);
      }
    };

    // Build
    var noAutoBuild = settings.dontAutoImportBuildNow;

    const buildButtonContent = () => {
      if (buildButtonDisabled || savingBuild) {
        return "Aplicando build...";
      } else if (!autoImportBuild) {
        return "Click para importar build";
      } else if (autoImportBuild && noAutoBuild) {
        return "Auto importación de build desactivada, click para reactivar";
      } else {
        return "Auto importación de build activa, click para desactivar";
      }
    };

    const buildButtonAction = () => {
      if (!autoImportBuild) {
        return this.applyBuild.bind(this);
      } else {
        return this.toggleAutoImportBuild.bind(this);
      }
    };

    return (
      <div className="selectChampImage">
        <div className="detailcard detailcard--squared detailcard--visible">
          <div className="detailcard__laneselector">
            <div className="detailcard__laneselector__border"></div>
            <select
              name="laneSelectedForRecommendations"
              value={lane}
              onChange={this.handleInput.bind(this)}
            >
              {champ.lanes.map((lane) => {
                return (
                  <option value={lane} key={lane}>
                    {lane}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="detailcard__border"></div>
          <div className="detailcard__background">
            <img src={getLoading(assets.img_links, champ.key)} alt="" />
          </div>
          <div className="detailcard__overlay"></div>

          <div className="detailcard__text">
            <div className="name">{champ.name}</div>
            <div className="title">{champ.title}</div>
            <div className="summoners">
              {spellsFromChamp(champ, assets, lane).map((spell, i) => {
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
          {/* Selector de Runas */}
          {visibleData == "runes" && (
            <CustomTooltip title={runeButtonContent()} placement="top">
              <div
                onClick={runeButtonAction()}
                className={classnames("runehandler fadeIn", {
                  disabled: runeButtonDisabled || settings.changingRunes,
                })}
              >
                <div className="runehandler__border"></div>
                {autoImportRunes && noAutoRunes && (
                  <span>
                    AutoImportar runas <i className="fas fa-ban"></i>
                  </span>
                )}
                {autoImportRunes && !noAutoRunes && (
                  <span>
                    AutoImportar runas <i className="fas fa-check-circle"></i>
                  </span>
                )}
                {!autoImportRunes && <span>Importar runas</span>}
              </div>
            </CustomTooltip>
          )}
          {/* Selector de build */}
          {visibleData == "build" && (
            <CustomTooltip title={buildButtonContent()} placement="top">
              <div
                onClick={buildButtonAction()}
                className={classnames("runehandler fadeIn", {
                  disabled: buildButtonDisabled || settings.savingBuild,
                })}
              >
                <div className="runehandler__border"></div>
                {autoImportBuild && noAutoBuild && (
                  <span>
                    AutoImportar build <i className="fas fa-ban"></i>
                  </span>
                )}
                {autoImportBuild && !noAutoBuild && (
                  <span>
                    AutoImportar build <i className="fas fa-check-circle"></i>
                  </span>
                )}
                {!autoImportBuild && <span>Importar build</span>}
              </div>
            </CustomTooltip>
          )}
        </div>
        {/* Toggle de opciones de campeon */}
        <div className="champImageExtraData">
          <div className="champImageExtraData__select">
            <select
              name="champSelectionVisibleData"
              value={visibleData}
              onChange={this.handleInput.bind(this)}
            >
              <option value="runes">Runas</option>
              <option value="build">Build</option>
              <option value="counters">Counters</option>
              <option value="champstats">Estadísticas del campeón</option>
              <option value="skillorder">Orden de habilidades</option>
              <option value="champanalytics">Análisis del campeón</option>
              <option value="gamephases">Winrate por minuto</option>
              <option value="damagedistribution">Distribución de daño</option>
            </select>
          </div>
          {/* Runas */}
          {visibleData == "runes" && (
            <div className="fadeIn">
              <RuneList runeType="champSelection" champ={champ} />
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
              <ItemList buildType="champSelection" champ={champ} />
            </div>
          )}
          {/* Phases */}
          {visibleData == "gamephases" && (
            <div className="fadeIn">
              <Phases champ={champ} />
            </div>
          )}
          {/* Winrate, banrate pickrate */}
          {visibleData == "champstats" && (
            <div className="fadeIn">
              <WinBanPickrate champ={champ} useConfig />
            </div>
          )}

          {/* Analytics */}
          {visibleData == "champanalytics" && (
            <div className="fadeIn">
              <RadarStats champ={champ} />
            </div>
          )}
          {/* damage distribution */}
          {visibleData == "damagedistribution" && (
            <div className="fadeIn">
              <DoughnutStats champ={champ} />
            </div>
          )}

          {/* Orden de skills */}
          {visibleData == "skillorder" && (
            <div className="fadeIn">
              <SkillOrder champ={champ} />
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
  settings: state.settings,
});

export default connect(mapStateToProps, { updateConfig })(ChampImage);
