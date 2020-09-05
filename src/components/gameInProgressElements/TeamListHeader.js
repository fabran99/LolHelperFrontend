import React, { Component } from "react";
import { connect } from "react-redux";

import { numberToDots, secondsToTime } from "../../helpers/general";
import goldIcon from "../../img/gold_icon.png";
import swordIcon from "../../img/sword_icon.png";
import turretIcon from "../../img/turret_icon.png";
import CustomTooltip from "../utility/CustomTooltip";
import baronIcon from "../../img/baronNashor.png";
import Air from "../../img/cloudDrake.png";
import Elder from "../../img/elderDrake.png";
import Fire from "../../img/infernalDrake.png";
import Earth from "../../img/mountainDrake.png";
import Water from "../../img/oceanDrake.png";
import {
  getNextDrakeTime,
  getNextBaronTime,
} from "../../functions/ingameFunctions";
import { isSummonerRift } from "../../functions/gameSession";

const INGAME_TEAM_NAMES = {
  ORDER: "teamOne",
  CHAOS: "teamTwo",
};

const DRAKE_IMAGES = { Air, Elder, Fire, Earth, Water };

export class TeamListHeader extends Component {
  render() {
    const {
      myTeamStats,
      theirTeamStats,
      timer,
      ingame,
      lcuConnector,
    } = this.props;

    var myTeamGold = myTeamStats.teamGold;
    var enemyTeamGold = theirTeamStats.teamGold;

    // Timers
    var isRift = isSummonerRift(lcuConnector.gameSession);
    var nextDrakeTime = null;
    var nextBaronTime = null;
    if (isRift) {
      nextDrakeTime = getNextDrakeTime(
        ingame,
        myTeamStats.dragonKills.length,
        theirTeamStats.dragonKills.length
      );
      nextBaronTime = getNextBaronTime(ingame);
    }

    console.log(nextDrakeTime);
    console.log(nextBaronTime);

    return (
      <div className="teams_score_header">
        <div className="score_block">
          <div className="score_row">
            <div className="score_col__big">
              <div className="scores scores--ally">
                <div className="drakes">
                  {myTeamStats.dragonKills.reverse().map((dk) => {
                    return (
                      <CustomTooltip
                        key={dk.EventID}
                        placement="bottom"
                        title={
                          <div className="tooltip">
                            <div className="tooltip__title">
                              {`${dk.DragonType} drake`}
                            </div>
                            <div className="tooltip__content">
                              Minuto:{" "}
                              <div className="value">
                                {secondsToTime(Math.round(dk.EventTime))}
                              </div>
                            </div>
                            <div className="tooltip__content">
                              Asesinado por:{" "}
                              <div className="value">{dk.KillerName}</div>
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`drakes__kill drakes__kill--${dk.DragonType}`}
                        >
                          <img src={DRAKE_IMAGES[dk.DragonType]} />
                        </div>
                      </CustomTooltip>
                    );
                  })}
                </div>

                <CustomTooltip
                  title="Torretas derribadas por tu equipo"
                  placement="bottom"
                >
                  <div className="turrets">
                    <img src={turretIcon} alt="" />
                    {myTeamStats.turretKills.length}
                  </div>
                </CustomTooltip>
                <CustomTooltip
                  title="Oro de objetos comprados por tu equipo"
                  placement="bottom"
                >
                  <div className="gold">
                    <img src={goldIcon} />
                    {numberToDots((myTeamGold / 1000).toFixed(2))}K
                  </div>
                </CustomTooltip>
                <div className="kills">{myTeamStats.teamKills}</div>
              </div>
            </div>
            <div className="score_col__small">
              <div className="versus">
                <img src={swordIcon} alt="" />
              </div>
            </div>
            <div className="score_col__big">
              <div className="scores scores--enemy">
                <div className="kills">{myTeamStats.enemyKills}</div>
                <CustomTooltip
                  placement="bottom"
                  title="Oro de objetos comprados por el equipo rival"
                >
                  <div className="gold">
                    <img src={goldIcon} alt="" />
                    {numberToDots((enemyTeamGold / 1000).toFixed(2))}K
                  </div>
                </CustomTooltip>
                <CustomTooltip
                  placement="bottom"
                  title="Torretas derribadas por el equipo rival"
                >
                  <div className="turrets">
                    <img src={turretIcon} alt="" />
                    {theirTeamStats.turretKills.length}
                  </div>
                </CustomTooltip>

                <div className="drakes">
                  {theirTeamStats.dragonKills.reverse().map((dk) => {
                    return (
                      <CustomTooltip
                        key={dk.EventID}
                        placement="bottom"
                        title={
                          <div className="tooltip">
                            <div className="tooltip__title">
                              {`${dk.DragonType} drake`}
                            </div>
                            <div className="tooltip__content">
                              Minuto:{" "}
                              <div className="value">
                                {secondsToTime(Math.round(dk.EventTime))}
                              </div>
                            </div>
                            <div className="tooltip__content">
                              Asesinado por:{" "}
                              <div className="value">{dk.KillerName}</div>
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`drakes__kill drakes__kill--${dk.DragonType}`}
                        >
                          <img src={DRAKE_IMAGES[dk.DragonType]} />
                        </div>
                      </CustomTooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="timer">
          <span>{timer}</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ingame: state.ingame,
  lcuConnector: state.lcuConnector,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TeamListHeader);
