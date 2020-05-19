import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { AiOutlineHome, AiOutlineBarChart } from "react-icons/ai";
import { RiSettings5Line } from "react-icons/ri";
import { MdGames } from "react-icons/md";

export class Navigation extends Component {
  render() {
    const { pathname } = this.props.history.location;
    return (
      <div
        className={classnames("navigation", {
          visible: this.props.navbar.visible,
        })}
      >
        <div className="nav_content">
          <Link
            to="/"
            className={classnames({
              selected: pathname == "/",
            })}
          >
            <AiOutlineHome /> Inicio
          </Link>
          <Link
            to="/ingame"
            className={classnames({
              selected: pathname == "/ingame",
            })}
          >
            <MdGames /> Ingame
          </Link>
          <Link
            to="/stats"
            className={classnames({
              selected: pathname == "/stats",
            })}
          >
            <AiOutlineBarChart /> Estadísticas
          </Link>
          <Link
            to="/config"
            className={classnames({
              selected: pathname == "/config",
            })}
          >
            <RiSettings5Line /> Configuración
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  lcuConnector: state.lcuConnector,
  navbar: state.navbar,
});

export default connect(mapStateToProps, null)(withRouter(Navigation));
