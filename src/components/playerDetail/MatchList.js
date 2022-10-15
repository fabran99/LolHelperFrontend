import React, { Component } from "react";
import { connect } from "react-redux";
import { icon_dict } from "../../helpers/iconDict";
import { queueTypeToName } from "../../functions/gameSession";
import CustomTooltip from "../utility/CustomTooltip";
import { getLaneFromRole, numberToDots } from "../../helpers/general";
import { getSquare } from "../../helpers/getImgLinks";

import moment from "moment";
import classnames from "classnames";
import MiniLoader from "../utility/MiniLoader";

export class MatchList extends Component {
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  showMatchDetail(gameId) {
    const { matchlist, updateMatchDetail } = this.props;
    updateMatchDetail(
      true,
      matchlist.find((item) => item.gameId == gameId)
    );
  }

  render() {
    const { assets, matchlist } = this.props;

    return (
      <React.Fragment>
        {matchlist && matchlist.length > 0 && (
          <div className="section_title">
            Partidas Recientes <small>(Últimas {matchlist.length})</small>
          </div>
        )}
        {matchlist && matchlist.length == 0 && (
          <div className="match_container_empty">
            No se encontraron partidas recientes
          </div>
        )}

        {!matchlist && <MiniLoader />}
        <div className="match_container">
          {matchlist &&
            matchlist.length > 0 &&
            matchlist.map((item) => {
              var lane = getLaneFromRole(item.role, item.lane);
              var icon = icon_dict[lane.toLowerCase()];
              var queue = queueTypeToName(item.queueType);
              var champData = this.getChampInfo(item.championId);

              var date = moment
                .unix(item.timestamp / 1000)
                .format("DD/MM/YYYY HH:mm");

              if (!champData) {
                return null;
              }

              const tooltipData = () => {
                return (
                  <div className="tooltip">
                    <div className="tooltip__title">
                      {item.win ? "Victoria" : "Derrota"}
                    </div>
                    <div className="tooltip__content">
                      KDA: <div className="value">{item.kda}</div>
                    </div>
                    <div className="tooltip__content">
                      CS: <div className="value">{item.csScore}</div>
                    </div>
                    <div className="tooltip__content">
                      CS por min: <div className="value">{item.csPerMin}</div>
                    </div>

                    <div className="tooltip__content">
                      Score de visión:{" "}
                      <div className="value">{item.visionScore}</div>
                    </div>
                    <div className="tooltip__content">
                      Oro obtenido:{" "}
                      <div className="value">
                        {numberToDots(item.goldEarned)}
                      </div>
                    </div>
                    <div className="tooltip__content">
                      Duración de la partida:{" "}
                      <div className="value">{item.gameDuration}</div>
                    </div>
                  </div>
                );
              };

              return (
                <CustomTooltip
                  placement="right"
                  title={tooltipData()}
                  key={item.gameId}
                >
                  <div
                    className="match"
                    onClick={() => {
                      this.showMatchDetail(item.gameId);
                    }}
                  >
                    <div className="match__champion">
                      <img src={getSquare(assets.img_links, champData.key)} />
                    </div>

                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <div className="gameresult">
                              <div
                                className={classnames("gameresult__value", {
                                  "gameresult__value--lose": !item.win,
                                })}
                              >
                                {item.win ? "Victoria" : "Derrota"}
                              </div>
                              <div className="lane">
                                <div className={`lane__icon`}>
                                  <img src={icon} />
                                </div>
                                <div className="lane__name">{lane}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="match__score">
                              <div className="kills">{item.kills}</div>
                              <div className="separators">/</div>
                              <div className="deaths">{item.deaths}</div>
                              <div className="separators">/</div>
                              <div className="assists">{item.assists}</div>
                            </div>
                          </td>
                          <td>
                            <div className="match__date">{queue}</div>
                          </td>
                          <td>
                            <small>{date}</small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CustomTooltip>
              );
            })}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MatchList);
