import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import CustomTooltip from "../../utility/CustomTooltip";
import { numberToDots } from "../../../helpers/general";
import { getSquare } from "../../../helpers/getImgLinks";
import { selectImgLinks } from "../../../redux/assets/assets.selectors";
import { selectChampionById } from "../../../redux/assets/assets.selectors";
import TeamPlayer from "./TeamPlayer";

const Team = (props) => {
  const { data, summonerId, isPlayerTeam, getChampionById, imgLinks } = props;

  // Manejo datos
  const teamKills = data.participants.reduce((acc, participant) => {
    return acc + participant.stats.kills;
  }, 0);
  const teamDeaths = data.participants.reduce((acc, participant) => {
    return acc + participant.stats.deaths;
  }, 0);
  const teamAssists = data.participants.reduce((acc, participant) => {
    return acc + participant.stats.assists;
  }, 0);
  const teamGold = data.participants.reduce((acc, participant) => {
    return acc + participant.stats.goldEarned;
  }, 0);
  return (
    <div
      className={classnames("team", {
        "team--player": isPlayerTeam,
      })}
    >
      <div className="row">
        <div className="col-9">
          {/* Estadisticas generales */}
          <div className="team__stats">
            <div className="row">
              <div className="col-4">
                <div className="team__stat">Equipo {isPlayerTeam ? 1 : 2}</div>
              </div>
              <div className="col-4">
                <div className="team__stat">
                  {teamKills} / {teamDeaths} / {teamAssists}
                </div>
              </div>
              <div className="col-4">
                <div className="team__stat">{numberToDots(teamGold)}</div>
              </div>
            </div>
          </div>
          {/* Lista de jugadores */}
          <div className="team__players">
            {data.participants.map((participant) => {
              let isCurrentPlayer =
                participant.identity.player.summonerId == summonerId;
              let currentChamp = getChampionById(participant.championId);
              let { items, runes } = participant;

              return (
                <TeamPlayer
                  key={participant.participantId}
                  items={items}
                  runes={runes}
                  isCurrentPlayer={isCurrentPlayer}
                  currentChamp={currentChamp}
                  participant={participant}
                />
              );
            })}
          </div>
        </div>
        <div className="col-3">
          <div className="team__bansAndObj">
            <div className="team__bansAndObj__title">Bloqueos + Objetivos</div>
            <div className="team__bansAndObj__bans">
              {data.teamStats.bans.map((ban, index) => {
                const champ = getChampionById(ban.championId);
                if (!champ)
                  return (
                    <div
                      className="team__bansAndObj__ban team__bansAndObj__ban--empty"
                      key={index}
                    ></div>
                  );
                return (
                  <CustomTooltip
                    key={index}
                    placement="top"
                    title={<div className="tooltip">{champ.name}</div>}
                  >
                    <div className="team__bansAndObj__ban">
                      <img src={getSquare(imgLinks, champ.key)} alt="" />
                    </div>
                  </CustomTooltip>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  assets: state.assets,
  imgLinks: selectImgLinks(state),
  getChampionById: (champId) => selectChampionById(champId)(state),
});

export default connect(mapStateToProps, null)(Team);
