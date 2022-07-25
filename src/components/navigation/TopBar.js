import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import { updateConfig } from "../../redux/settings/settings.actions";

import { selectLcuIsConnected } from "../../redux/lcuConnector/lcuConnector.selectors";
import { selectSummonerName } from "../../redux/summoner/summoner.selectors";
import { selectAssetsLoaded } from "../../redux/assets/assets.selectors";

const currentWindow = electron.remote.getCurrentWindow();

export class TopBar extends Component {
  minimize = () => {
    currentWindow.minimize();
  };
  close = () => {
    currentWindow.close();
  };

  showConfiguration = () => {
    this.props.updateConfig({ settingsVisible: true });
  };

  render() {
    const { location, assetsLoaded, lcuIsConnected, summonerName } = this.props;
    const isActive = (path) => {
      return location.pathname == path;
    };

    const showIngame = lcuIsConnected || process.env.NODE_ENV == "development";

    return (
      <div className="top_bar">
        {assetsLoaded && (
          <div className="links">
            <Link
              to="/"
              className={classnames({
                active: isActive("/"),
              })}
            >
              Inicio
            </Link>
            {showIngame && (
              <Link
                to="/ingame"
                className={classnames({
                  active: isActive("/ingame"),
                })}
              >
                Ingame
              </Link>
            )}
          </div>
        )}
        <div className="navbar_logo"></div>
        {summonerName && <div className="navbar_summoner">{summonerName}</div>}

        <div className="icons">
          <div className="minimize" onClick={this.minimize}>
            <i className="fas fa-window-minimize"></i>
          </div>
          <div className="configuration" onClick={this.showConfiguration}>
            <i className="fas fa-cog"></i>
          </div>
          <div className="close" onClick={this.close}>
            <i className="fas fa-times"></i>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assetsLoaded: selectAssetsLoaded(state),
  lcuIsConnected: selectLcuIsConnected(state),
  summonerName: selectSummonerName(state),
});

export default connect(mapStateToProps, { updateConfig })(withRouter(TopBar));
