import React, { useState } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

import {
  selectImgLinks,
  selectChampionInfoExists,
  selectChampionsAsDict,
} from "../../../../../redux/assets/assets.selectors";
import CustomTooltip from "../../../../utility/tooltip/tooltip.component";

import { getIcon, getSquare } from "../../../../../helpers/getImgLinks";
import {
  numberToDots,
  milisecondsToDate,
  queueTypeToName,
  getLaneFromRole,
} from "../../../../../helpers/utilities";

const SummonerSummary = ({ summoner, imgLinks, assetsExists, champions }) => {
  const {
    profileIconId,
    tier,
    division,
    displayName,
    wins,
    masteries,
    matchlist,
  } = summoner;
  const [isActive, setIsActive] = useState(false);
  const toggle = () => {
    setIsActive(!isActive);
  };

  if (!assetsExists) {
    return;
  }

  var lastMatches = matchlist.slice(0, 5);
  var bestChamps = masteries.slice(0, 3);

  return (
    <div className="summoner_summary">
      {/* Card */}
      <div
        className={classnames("summoner_summary__card", {
          active: isActive,
        })}
        onClick={toggle}
      >
        <div className="row">
          <div className="col-8">
            <div className="summoner_summary__card__name">{displayName}</div>
            <div className="summoner_summary__card__subtitle">
              {tier && tier != "NONE" ? tier : null}
              {division && division != "NA" ? ` ${division}` : null}
            </div>
          </div>
          <div className="col-4">
            <div className="summoner_summary__card__icon">
              <div className="icon">
                <img src={getIcon(imgLinks, profileIconId)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail */}

      {isActive && (
        <div className="summoner_summary__detail">
          <div className="content">
            <div className="section">
              <div className="section__title">Campeónes más jugados</div>
              <div className="section__content">
                <div className="champ_list">
                  {bestChamps.map((champ, i) => {
                    var currentChamp = champions[champ.championId];

                    const tooltipData = () => {
                      return (
                        <div className="tooltip">
                          <div className="tooltip__title">
                            {currentChamp.name}
                          </div>
                          <div className="tooltip__content">
                            <div className="key">Maestría:</div>
                            <div className="value">
                              {numberToDots(champ.championPoints)}
                            </div>
                          </div>
                          <div className="tooltip__content">
                            <div className="key">Jugado por última vez:</div>
                            <div className="value">
                              {milisecondsToDate(champ.lastPlayTime)}
                            </div>
                          </div>
                        </div>
                      );
                    };

                    return (
                      <CustomTooltip
                        key={champ.championId}
                        title={tooltipData()}
                        arrow
                      >
                        <div className="champ">
                          <div className="champ__icon">
                            <img src={getSquare(imgLinks, currentChamp.key)} />
                          </div>
                        </div>
                      </CustomTooltip>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section__title">Últimas partidas</div>
              <div className="section__content">
                <div className="champ_list">
                  {lastMatches.map((match, i) => {
                    var currentChamp = champions[match.championId];

                    const tooltipData = () => {
                      return (
                        <div className="tooltip">
                          <div
                            className={`tooltip__title tooltip__title--${
                              match.win ? "skyblue" : "pink"
                            }`}
                          >
                            {match.win ? "Victoria" : "Derrota"}
                          </div>

                          <div className="tooltip__content">
                            <div className="key">Línea:</div>
                            <div className="value">
                              {getLaneFromRole(match.role, match.lane)}
                            </div>
                          </div>
                          <div className="tooltip__content">
                            <div className="key">KDA:</div>
                            <div className="value">{match.kda}</div>
                          </div>
                          <div className="tooltip__content">
                            <div className="key">Fecha:</div>
                            <div className="value">
                              {milisecondsToDate(match.timestamp)}
                            </div>
                          </div>
                          <div className="tooltip__content">
                            <div className="key">Duración:</div>
                            <div className="value">{match.gameDuration}</div>
                          </div>
                          <div className="tooltip__content">
                            <div className="key">Modo:</div>
                            <div className="value">
                              {queueTypeToName(match.queueType)}
                            </div>
                          </div>
                        </div>
                      );
                    };

                    return (
                      <CustomTooltip arrow title={tooltipData()}>
                        <div
                          className={`champ champ--${
                            match.win ? "win" : "lose"
                          }`}
                          key={match.gameId}
                        >
                          <div className="champ__icon">
                            <img src={getSquare(imgLinks, currentChamp.key)} />
                          </div>
                        </div>
                      </CustomTooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  summoner: state.summoner,
  imgLinks: selectImgLinks(state),
  assetsExists: selectChampionInfoExists(state),
  champions: selectChampionsAsDict(state),
});

export default connect(mapStateToProps, null)(SummonerSummary);
