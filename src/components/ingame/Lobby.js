import React, { Component } from "react";
import { connect } from "react-redux";
import LobbyPlayerItem from "../lobby/LobbyPlayerItem";
import { getGameName } from "../../functions/gameSession";

import { updateConfig } from "../../actions/configActions";
import Loading from "../utility/Loading";

export class Lobby extends Component {
  getGameName() {
    const { gameSession } = this.props;
    return getGameName(gameSession);
  }

  changeLane(e) {
    var autoAskLane = e.target.value;

    this.props.updateConfig({
      autoAskLane,
    });
  }

  render() {
    const { gameSession, autoAskLane, lobby } = this.props;
    if (!lobby || !gameSession) {
      return <Loading />;
    }
    const { members, localMember } = lobby;
    var currentSummonerId = localMember.summonerId;

    var showAutoPick = false;
    try {
      var gameModesToAutoPick = ["NORMAL", "BOT"];
      if (
        gameModesToAutoPick.indexOf(gameSession.gameData.queue.type) != -1 &&
        gameSession.gameData.queue.gameMode == "CLASSIC" &&
        gameSession.gameData.queue.gameTypeConfig.name ==
          "GAME_CFG_TEAM_BUILDER_BLIND"
      ) {
        showAutoPick = true;
      }
    } catch {
      showAutoPick = false;
    }

    var teams = {};

    members.forEach((member) => {
      if (member.teamId in teams) {
        teams[member.teamId].push(member);
      } else {
        teams[member.teamId] = [member];
      }
    });

    var team_list = Object.keys(teams).map((key) => teams[key]);

    return (
      <div className="lobbyContainer">
        {showAutoPick && (
          <div className="autoLaneSelector">
            <select
              name="lane"
              value={autoAskLane}
              onChange={this.changeLane.bind(this)}
            >
              <option value="">No pedir línea</option>
              <option value="MID">Pedir Mid</option>
              <option value="SUPP">Pedir Support</option>
              <option value="ADC">Pedir ADC</option>
              <option value="TOP">Pedir Top</option>
              <option value="JG"> Pedir Jungla</option>
            </select>
          </div>
        )}
        <div className="header_text ">
          Lobby - {gameSession.map.gameModeShortName}
        </div>
        <div className="lobby">
          {team_list.map((team, k) => {
            return (
              <div className="lobby__list" key={k}>
                {team.map((member, i) => {
                  return (
                    <LobbyPlayerItem
                      isLocalPlayer={currentSummonerId == member.summonerId}
                      player={member}
                      key={member.summonerId}
                      multiTeams={team_list.length > 1}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lobby: state.lcuConnector.lobby,
  autoAskLane: state.configuration.autoAskLane,
  gameSession: state.lcuConnector.gameSession,
});
export default connect(mapStateToProps, { updateConfig })(Lobby);
