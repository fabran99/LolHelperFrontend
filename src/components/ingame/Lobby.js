import React, { Component } from "react";
import { connect } from "react-redux";
import LobbyPlayerItem from "../lobby/LobbyPlayerItem";

import { updateConfig } from "../../redux/settings/settings.actions";
import Loading from "../utility/Loading";
import { selectAutoAskLane } from "../../redux/settings/settings.selectors";
import {
  selectGameQueue,
  selectGameName,
  selectGameModeShortName,
} from "../../redux/gameSession/gameSession.selectors";
import {
  selectMembers,
  selectLocalSummonerId,
} from "../../redux/lobby/lobby.selectors";

const Lobby = (props) => {
  const {
    gameQueue,
    autoAskLane,
    members,
    localSummonerId,
    gameModeShortName,
    updateConfig,
  } = props;

  const changeLane = (e) => {
    let lane = e.target.value;

    updateConfig({
      autoAskLane: lane,
    });
  };

  if (!localSummonerId || !gameQueue) {
    return <Loading />;
  }

  var showAutoPick = false;
  try {
    var gameModesToAutoPick = ["NORMAL", "BOT"];
    if (
      gameModesToAutoPick.indexOf(gameQueue.type) != -1 &&
      gameQueue.gameMode == "CLASSIC" &&
      gameQueue.gameTypeConfig.name == "GAME_CFG_TEAM_BUILDER_BLIND"
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
          <select name="lane" value={autoAskLane} onChange={changeLane}>
            <option value="">No pedir línea</option>
            <option value="MID">Pedir Mid</option>
            <option value="SUPP">Pedir Support</option>
            <option value="ADC">Pedir ADC</option>
            <option value="TOP">Pedir Top</option>
            <option value="JG"> Pedir Jungla</option>
          </select>
        </div>
      )}
      <div className="header_text ">Lobby - {gameModeShortName}</div>
      <div className="lobby">
        {team_list.map((team, k) => {
          return (
            <div className="lobby__list" key={k}>
              {team.map((member, i) => {
                return (
                  <LobbyPlayerItem
                    isLocalPlayer={localSummonerId == member.summonerId}
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
};

const mapDispatchToProps = (dispatch) => ({
  updateConfig: (data) => dispatch(updateConfig(data)),
});

const mapStateToProps = (state) => ({
  gameQueue: selectGameQueue(state),
  gameName: selectGameName(state),
  gameModeShortName: selectGameModeShortName(state),
  autoAskLane: selectAutoAskLane(state),
  members: selectMembers(state),
  localSummonerId: selectLocalSummonerId(state),
});
export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
