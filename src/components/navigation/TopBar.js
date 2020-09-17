import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import { updateConfig } from "../../actions/configActions";
import logo from "../../img/heimericon.png";

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
            {/* <Link
              to="/profile"
              className={classnames({
                active: isActive("/profile"),
              })}
            >
              Perfil
            </Link> */}
            <span
              className={classnames({
                active: configurationVisible,
              })}
              onClick={this.showConfiguration}
            >
              Opciones
            </span>
          </div>
        )}
        <div className="navbar_logo">
          {/* <img src={logo} alt="" /> */}
          <div className="navbar_logo__content">
            {process.env.REACT_APP_VERSION}
          </div>
        </div>
        {summoner && summoner.displayName && (
          <div className="navbar_summoner">{summoner.displayName}</div>
        )}

        <div className="icons">
          <div className="minimize" onClick={this.minimize}>
            <span></span>
          </div>
          <div className="close" onClick={this.close}>
            <span></span>
            <span></span>
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
