import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import { updateConfig } from "../../redux/config/config.actions";

const currentWindow = electron.remote.getCurrentWindow();

export class TopBar extends Component {
  minimize = () => {
    currentWindow.minimize();
  };
  close = () => {
    currentWindow.close();
  };

  showConfiguration = () => {
    this.props.updateConfig({ configurationVisible: true });
  };

  render() {
    const {
      location,
      lcuConnector,
      assets,
      summoner,
      configuration,
    } = this.props;
    const { configurationVisible } = configuration;

    const isActive = (path) => {
      return location.pathname == path;
    };

    const showIngame =
      lcuConnector.connected || process.env.NODE_ENV == "development";

    return (
      <div className="top_bar">
        {assets.champions && (
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
        {summoner && summoner.displayName && (
          <div className="navbar_summoner">{summoner.displayName}</div>
        )}

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
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  summoner: state.summoner,
  configuration: state.configuration,
});

export default connect(mapStateToProps, { updateConfig })(withRouter(TopBar));
