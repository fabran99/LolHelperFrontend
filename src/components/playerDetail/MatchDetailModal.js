import React, { Component } from "react";
import { connect } from "react-redux";
import bg from "../../img/universe-bg.jpg";
import Team from "./matchDetailComponents/Team";
import moment from "moment";
import { queueTypeToName } from "../../functions/gameSession";
import {
  selectChampionById,
  selectItemsAsDict,
} from "../../redux/assets/assets.selectors";

export class MatchDetailModal extends Component {
  close() {
    this.props.updateMatchDetail(false, null);
  }

  parseMatchDetail() {
    const { matchDetail, getChampionById, itemsDict } = this.props;

    console.log(matchDetail);
    let result = {
      gameData: {
        gameDuration: matchDetail.gameDuration,
      },
      playerData: {
        champion: getChampionById(matchDetail.championId).name,
        score: {
          kills: matchDetail.kills,
          deaths: matchDetail.deaths,
          assists: matchDetail.assists,
        },
        goldEarned: matchDetail.goldEarned,
        lane: matchDetail.lane,
        role: matchDetail.role,
      },
    };

    const team1Info = {
      participants: matchDetail.fullGameData.participants.filter(
        (participant) => participant.teamId == 100
      ),
      teamStats: matchDetail.fullGameData.teams[0],
    };
    const team2Info = {
      participants: matchDetail.fullGameData.participants.filter(
        (participant) => participant.teamId == 200
      ),
      teamStats: matchDetail.fullGameData.teams[1],
    };

    team1Info.participants = team1Info.participants.map((participant) => {
      let data = { ...participant };
      data.identity = matchDetail.fullGameData.participantIdentities.find(
        (identity) => identity.participantId == participant.participantId
      );
      return data;
    });
    team2Info.participants = team2Info.participants.map((participant) => {
      let data = { ...participant };
      data.identity = matchDetail.fullGameData.participantIdentities.find(
        (identity) => identity.participantId == participant.participantId
      );
      return data;
    });

    let playerTeam = matchDetail.teamId == 100 ? team1Info : team2Info;
    let enemyTeam = matchDetail.teamId == 100 ? team2Info : team1Info;

    result.playerTeam = {
      teamId: matchDetail.teamId,
      participants: playerTeam.participants.map((participant) => {
        const items = [
          participant.stats.item0,
          participant.stats.item1,
          participant.stats.item2,
          participant.stats.item3,
          participant.stats.item4,
          participant.stats.item5,
          participant.stats.item6,
        ];

        let itemsData = items.map((item) => {
          let info = itemsDict[item];
          return {
            id: item,
            name: info ? info.name : "",
            price: info ? info.price : 0,
          };
        });

        return {
          champion: getChampionById(participant.championId).name,
          score: {
            assists: participant.stats.assists,
            deaths: participant.stats.deaths,
            kills: participant.stats.kills,
          },
          goldEarned: participant.stats.goldEarned,
          goldSpent: participant.stats.goldSpent,
          lane: participant.timeline.lane,
          role: participant.timeline.role,
          // items: itemsData,
        };
      }),
      baronKills: playerTeam.teamStats.baronKills,
      dragonKills: playerTeam.teamStats.dragonKills,
      towerKills: playerTeam.teamStats.towerKills,
      inhibitorKills: playerTeam.teamStats.inhibitorKills,
      riftHeraldKills: playerTeam.teamStats.riftHeraldKills,
    };
    result.playerTeam.goldEarned = result.playerTeam.participants.reduce(
      (acc, participant) => acc + participant.goldEarned,
      0
    );
    result.playerTeam.goldSpent = result.playerTeam.participants.reduce(
      (acc, participant) => acc + participant.goldSpent,
      0
    );

    result.enemyTeam = {
      teamId: matchDetail.teamId == 100 ? 200 : 100,
      participants: enemyTeam.participants.map((participant) => {
        const items = [
          participant.stats.item0,
          participant.stats.item1,
          participant.stats.item2,
          participant.stats.item3,
          participant.stats.item4,
          participant.stats.item5,
          participant.stats.item6,
        ];

        let itemsData = items.map((item) => {
          let info = itemsDict[item];
          return {
            id: item,
            name: info ? info.name : "",
            price: info ? info.price : 0,
          };
        });

        return {
          champion: getChampionById(participant.championId)?.name,
          score: {
            assists: participant.stats.assists,
            deaths: participant.stats.deaths,
            kills: participant.stats.kills,
          },
          goldEarned: participant.stats.goldEarned,
          goldSpent: participant.stats.goldSpent,
          lane: participant.timeline.lane,
          role: participant.timeline.role,
          // items: itemsData,
        };
      }),
      baronKills: enemyTeam.teamStats.baronKills,
      dragonKills: enemyTeam.teamStats.dragonKills,
      towerKills: enemyTeam.teamStats.towerKills,
      inhibitorKills: enemyTeam.teamStats.inhibitorKills,
      riftHeraldKills: enemyTeam.teamStats.riftHeraldKills,
    };

    result.enemyTeam.goldEarned = result.enemyTeam.participants.reduce(
      (acc, participant) => acc + participant.goldEarned,
      0
    );
    result.enemyTeam.goldSpent = result.enemyTeam.participants.reduce(
      (acc, participant) => acc + participant.goldSpent,
      0
    );
  }
  render() {
    const { matchDetail, summonerId } = this.props;
    this.parseMatchDetail();

    // Inicio la info para cada team
    const team1Info = {
      participants: matchDetail.fullGameData.participants.filter(
        (participant) => participant.teamId == 100
      ),
      teamStats: matchDetail.fullGameData.teams[0],
    };
    const team2Info = {
      participants: matchDetail.fullGameData.participants.filter(
        (participant) => participant.teamId == 200
      ),
      teamStats: matchDetail.fullGameData.teams[1],
    };

    team1Info.participants = team1Info.participants.map((participant) => {
      let data = { ...participant };
      data.identity = matchDetail.fullGameData.participantIdentities.find(
        (identity) => identity.participantId == participant.participantId
      );
      return data;
    });
    team2Info.participants = team2Info.participants.map((participant) => {
      let data = { ...participant };
      data.identity = matchDetail.fullGameData.participantIdentities.find(
        (identity) => identity.participantId == participant.participantId
      );
      return data;
    });

    // Inffo de la partida
    var queue = queueTypeToName(matchDetail.queueType);
    var date = moment
      .unix(matchDetail.timestamp / 1000)
      .format("DD/MM/YYYY HH:mm");
    var gameDuration = matchDetail.gameDuration;

    return (
      <div className="modal">
        <div className="modal__background" onClick={() => this.close()}></div>

        <div
          className="modal__content"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="modal__close" onClick={() => this.close()}>
            <i className="fas fa-times"></i>
          </div>

          {/* Contenido */}
          <div className="modal__bar">Detalle de partida</div>
          <div className="modal__content_data">
            <div className="row">
              {/* Info general */}
              <div className="col-12">
                <div className="gameinfo">
                  <div className="gameinfo__winner">
                    {matchDetail.win ? "Victoria" : "Derrota"}
                  </div>
                  <div className="gameinfo__queue">{queue}</div>
                  <div className="gameinfo__date">
                    {date} - {gameDuration}
                  </div>
                </div>
              </div>
              {/* Teams */}
              <div className="col-12">
                <div className="teams">
                  <Team
                    data={team1Info}
                    summonerId={summonerId}
                    isPlayerTeam={matchDetail.teamId == 100}
                  />
                  <Team
                    data={team2Info}
                    summonerId={summonerId}
                    isPlayerTeam={matchDetail.teamId == 200}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getChampionById: (champId) => selectChampionById(champId)(state),
  itemsDict: selectItemsAsDict(state),
});

export default connect(mapStateToProps, null)(MatchDetailModal);
