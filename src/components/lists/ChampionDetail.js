import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getLoading } from "../../helpers/getImgLinks";
import { icon_dict } from "../../helpers/iconDict";

import RuneList from "../champExtraElements/RuneList";
import ItemList from "../champExtraElements/ItemList";
import CountersList from "../champExtraElements/CountersList";
import Phases from "../champExtraElements/Phases";
import SkillOrder from "../champExtraElements/SkillOrder";
import RadarStats from "../champExtraElements/RadarStats";
import DoughnutStats from "../champExtraElements/DoughnutStats";
import WinBanPickrate from "../champExtraElements/WinBanPickrate";

export class ChampionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible_element: "Runas (ADC)",
    };
  }

  componentDidMount() {
    this.checkVisibleElement();
  }

  componentDidUpdate(prevProps) {
    // Controlo que la opcion del select sea valida para el personaje cuando cambia
    if (
      (!prevProps.champ_data && this.props.champ_data) ||
      prevProps.champ_data.name != this.props.champ_data.name
    ) {
      this.checkVisibleElement();
    }
  }

  checkVisibleElement() {
    var { visible_element } = this.state;
    var general_elements = [
      "champanalytics",
      "champstats",
      "damagedistribution",
      "counters",
      "gamephases",
      "skillorder",
    ];
    if (general_elements.indexOf(visible_element) == -1) {
      if (visible_element.indexOf("Runas") != -1) {
        let lane = visible_element.split("Runas (")[1].split(")")[0];
        if (this.props.champ_data.lanes.indexOf(lane) == -1) {
          this.setState({
            visible_element: `Runas (${this.props.champ_data.lanes[0]})`,
          });
        }
      } else if (visible_element.indexOf("Build") != -1) {
        let lane = visible_element.split("Build (")[1].split(")")[0];
        if (this.props.champ_data.lanes.indexOf(lane) == -1) {
          this.setState({
            visible_element: `Build (${this.props.champ_data.lanes[0]})`,
          });
        }
      } else {
        this.setState({ visible_element: "champanalytics" });
      }
    }
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { champ_data, assets } = this.props;
    const { img_links } = assets;

    const { visible_element } = this.state;

    return (
      <div className="championdetail">
        <div className="detailcard">
          <div className="detailcard__border"></div>
          <div className="detailcard__background">
            <img src={getLoading(img_links, champ_data.key)} alt="" />
          </div>
          <div className="detailcard__overlay"></div>
          <div className="detailcard__text">
            <div className="name">{champ_data.name}</div>
            <div className="title">{champ_data.title}</div>
            <div className="lane">
              {champ_data.info_by_lane.map((laneinfo) => {
                return (
                  <React.Fragment key={laneinfo.lane}>
                    <div
                      className={`lane__icon lane__icon--${laneinfo.lane.toLowerCase()}`}
                    >
                      <img
                        src={icon_dict[laneinfo.lane.toLowerCase()]}
                        alt=""
                      />
                    </div>
                    <div className="lane__name">{laneinfo.lane}</div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        {/* Toggle de opciones de campeon */}
        <div className="champImageExtraData">
          <div className="champImageExtraData__select">
            <select
              name="visible_element"
              value={visible_element}
              onChange={this.handleInput.bind(this)}
            >
              <option value="champstats">Estadísticas del campeón</option>
              <option value="champanalytics">Análisis del campeón</option>
              <option value="counters">Counters</option>
              <option value="damagedistribution">Distribución de daño</option>
              <option value="gamephases">Winrate por minuto</option>
              <option value="skillorder">Orden de habilidades</option>

              {champ_data.lanes.map((lane) => {
                return (
                  <option key={lane} value={`Runas (${lane})`}>
                    Runas ({lane})
                  </option>
                );
              })}
              {champ_data.lanes.map((lane) => {
                return (
                  <option key={lane} value={`Build (${lane})`}>
                    Build ({lane})
                  </option>
                );
              })}
            </select>
          </div>
          {/* Runas */}
          {champ_data.lanes.map((lane) => {
            let text = `Runas (${lane})`;
            if (visible_element != text) {
              return null;
            }

            return (
              <div className="fadeIn" key={lane}>
                <RuneList runeType="home" champ={champ_data} lane={lane} />
              </div>
            );
          })}
          {/* Builds */}
          {champ_data.lanes.map((lane) => {
            let text = `Build (${lane})`;
            if (visible_element != text) {
              return null;
            }

            return (
              <div className="fadeIn" key={lane}>
                <ItemList buildType="home" champ={champ_data} lane={lane} />
              </div>
            );
          })}

          {/* Winrate, banrate pickrate */}
          {visible_element == "champstats" && (
            <div className="fadeIn">
              <WinBanPickrate champ={champ_data} />
            </div>
          )}

          {/* Counters */}
          {visible_element == "counters" && (
            <div className="fadeIn">
              <CountersList champ={champ_data} />
            </div>
          )}

          {/* Analytics */}
          {visible_element == "champanalytics" && (
            <div className="fadeIn">
              <RadarStats champ={champ_data} />
            </div>
          )}
          {/* damage distribution */}
          {visible_element == "damagedistribution" && (
            <div className="fadeIn">
              <DoughnutStats champ={champ_data} />
            </div>
          )}
          {/* Phases del juego */}
          {visible_element == "gamephases" && (
            <div className="fadeIn">
              <Phases champ={champ_data} />
            </div>
          )}
          {/* Orden de skills */}
          {visible_element == "skillorder" && (
            <div className="fadeIn">
              <SkillOrder champ={champ_data} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(ChampionDetail);
