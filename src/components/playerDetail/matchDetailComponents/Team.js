import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import CustomTooltip from "../../utility/CustomTooltip";
import { numberToDots } from "../../../helpers/general";
import { getSquare } from "../../../helpers/getImgLinks";
import Build from "./Build";
import Runes from "./Runes";
import { selectImgLinks } from "../../../redux/assets/assets.selectors";
import { selectChampionById } from "../../../redux/assets/assets.selectors";
import SummonerSpell from "./SummonerSpell";

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
              const items = [
                participant.stats.item0,
                participant.stats.item1,
                participant.stats.item2,
                participant.stats.item3,
                participant.stats.item4,
                participant.stats.item5,
                participant.stats.item6,
              ];
              const runes = {
                primary: {
                  main: participant.stats.perkPrimaryStyle,
                  perk0: participant.stats.perk0,
                  perk1: participant.stats.perk1,
                  perk2: participant.stats.perk2,
                  perk3: participant.stats.perk3,
                },
                secondary: {
                  main: participant.stats.perkSubStyle,
                  perk4: participant.stats.perk4,
                  perk5: participant.stats.perk5,
                },
              };

              return (
                <div
                  className={classnames("team__player", {
                    "team__player--current": isCurrentPlayer,
                  })}
                  key={participant.participantId}
                >
                  <div className="row">
                    {/* Nombre */}
                    <div className="col-4">
                      <div className="team__player__runes">
                        <Runes runeData={runes} />
                      </div>
                      <div className="team__player__sums">
                        <SummonerSpell spellId={participant.spell1Id} />
                        <SummonerSpell spellId={participant.spell2Id} />
                      </div>
                      <div className="team__player__champ">
                        <img
                          src={getSquare(imgLinks, currentChamp.key)}
                          alt=""
                        />
                      </div>{" "}
                      <CustomTooltip
                        placement="top"
                        title={
                          <div className="tooltip">
                            {participant.identity.player.summonerName}
                          </div>
                        }
                      >
                        <div className="team__player__name">
                          {participant.identity.player.summonerName}
                        </div>
                      </CustomTooltip>
                    </div>
                    {/* Items */}
                    <div className="col-4">
                      <div className="team__player__build">
                        <Build build={items} />
                      </div>
                    </div>
                    {/* Estadisticas */}
                    <div className="col-4">
                      <div className="team__player__data">
                        <div className="team__player__kda">
                          {participant.stats.kills} / {participant.stats.deaths}{" "}
                          / {participant.stats.assists}
                        </div>
                        <div className="team__player__farm">
                          {participant.stats.totalMinionsKilled}
                        </div>
                        <div className="team__player__gold">
                          {numberToDots(participant.stats.goldEarned)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
