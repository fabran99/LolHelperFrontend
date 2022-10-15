import React, { Component } from "react";
import { connect } from "react-redux";
import { getTeams } from "../../functions/ingameFunctions";

import { getGameName } from "../../functions/gameSession";
import { secondsToTime } from "../../helpers/general";

import ChampImage from "../gameInProgressElements/ChampImage";
import Loading from "../utility/Loading";
import TeamsList from "../gameInProgressElements/TeamsList";
import { asyncGetSummonerInfoByName } from "../../electron/getLauncherData";
import { gameSessionChange } from "../../redux/gameSession/gameSession.actions";
import { selectLcuIsConnected } from "../../redux/lcuConnector/lcuConnector.selectors";
import { selectAllPlayers } from "../../redux/ingame/ingame.selectors";
import {
  selectGameSessionGameData,
  selectIngameTeams,
} from "../../redux/gameSession/gameSession.selectors";
import { selectSummonerData } from "../../redux/summoner/summoner.selectors";

export class GameInProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      findingSummonerData: false,
    };
  }
  getGameName() {
    const { lcuConnector } = this.props;
    return getGameName(lcuConnector.gameSession);
  }

  getTeams() {
    const { summoner, assets, ingameTeams, gameData, allPlayers } = this.props;
    if (
      gameData.teamOne &&
      gameData.teamTwo &&
      gameData.teamOne.length == 0 &&
      gameData.teamTwo.length == 0 &&
      ingameTeams
    ) {
      gameData.teamOne = ingameTeams.teamOne;
      gameData.teamTwo = ingameTeams.teamTwo;
    }

    return getTeams(gameData, summoner, allPlayers, assets);
  }
  async handlePlayersFromIngameData() {
    if (this.state.findingSummonerData) {
      return;
    }
    this.setState({ findingSummonerData: true });
    var teamOne = [];
    var teamTwo = [];

    for (var i = 0; i < this.props.allPlayers.length; i++) {
      let playerData = this.props.allPlayers[i];
      let summData = {};
      if (!playerData.isBot) {
        summData = await asyncGetSummonerInfoByName(
          this.props.lcuConnector.connection,
          playerData.summonerName
        );
      }
      playerData = { ...playerData, ...summData };
      if (playerData.team == "ORDER") {
        teamOne.push(playerData);
      } else {
        teamTwo.push(playerData);
      }
    }
    let data = {
      teams: { teamOne, teamTwo },
    };
    this.props.gameSessionChange({ data });
  }

  componentDidMount() {
    const { gameData, lcuIsConnected, allPlayers } = this.props;
    if (
      !this.state.findingSummonerData &&
      gameData &&
      gameData.teamOne.length == 0 &&
      gameData.teamTwo.length == 0
    ) {
      if (lcuIsConnected && allPlayers) {
        this.handlePlayersFromIngameData();
      }
    }
  }

  componentDidUpdate() {
    const { gameData, lcuIsConnected, allPlayers } = this.props;
    if (
      !this.state.findingSummonerData &&
      gameData &&
      gameData.teamOne.length == 0 &&
      gameData.teamTwo.length == 0
    ) {
      if (lcuIsConnected && allPlayers) {
        this.handlePlayersFromIngameData();
      }
    }
  }

  render() {
    const { summoner, lcuIsConnected } = this.props;
    if (!lcuIsConnected) {
      return null;
    }
    const { teamOne, teamTwo, localTeam } = this.getTeams();

    if (!summoner) {
      return <Loading />;
    }

    return (
      <div className="inProgress">
        {/* Content */}
        <div className="row">
          <div className="col-3">
            {/* Imagen del champ */}
            <ChampImage />
          </div>
          <div className="col-9">
            {/* Datos de la partida*/}
            <TeamsList
              myTeam={localTeam == "teamOne" ? teamOne : teamTwo}
              theirTeam={localTeam == "teamOne" ? teamTwo : teamOne}
              localTeam={localTeam}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  summoner: selectSummonerData(state),
  lcuIsConnected: selectLcuIsConnected(state),
  allPlayers: selectAllPlayers(state),
  gameData: selectGameSessionGameData(state),
  ingameTeams: selectIngameTeams(state),
});

const mapDispatchToProps = {
  gameSessionChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameInProgress);
