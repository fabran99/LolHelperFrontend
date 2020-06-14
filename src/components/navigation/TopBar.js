import React, { Component } from "react";
import { connect } from "react-redux";
import { electron } from "../../helpers/outsideObjects";
import { Link, withRouter } from "react-router-dom";
import classnames from "classnames";
import logo from "../../img/heimericon.png";

const currentWindow = electron.remote.getCurrentWindow();

export class TopBar extends Component {
  minimize = () => {
    currentWindow.minimize();
  };
  close = () => {
    currentWindow.close();
  };

  render() {
    const isActive = (path) => {
      return this.props.location.pathname == path;
    };
    return (
      <div className="top_bar">
        <div className="links">
          <Link
            to="/"
            className={classnames({
              active: isActive("/"),
            })}
          >
            Inicio
          </Link>
          <Link
            to="/ingame"
            className={classnames({
              active: isActive("/ingame"),
            })}
          >
            InGame
          </Link>
          <Link
            to="/profile"
            className={classnames({
              active: isActive("/profile"),
            })}
          >
            Perfil
          </Link>
          <Link
            to="/configuration"
            className={classnames({
              active: isActive("/configuration"),
            })}
          >
            Configuración
          </Link>
        </div>

        <div className="navbar_logo">
          <img src={logo} alt="" />
        </div>

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
});

export default connect(mapStateToProps, null)(withRouter(TopBar));
