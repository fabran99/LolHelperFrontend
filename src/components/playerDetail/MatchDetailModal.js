import React, { Component } from "react";
import { connect } from "react-redux";
import bg from "../../img/universe-bg.jpg";
import Team from "./matchDetailComponents/Team";
import moment from "moment";
import { queueTypeToName } from "../../functions/gameSession";

export class MatchDetailModal extends Component {
  close() {
    this.props.updateMatchDetail(false, null);
  }
  render() {
    const { matchDetail, summonerId } = this.props;

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

export default connect(null, null)(MatchDetailModal);
