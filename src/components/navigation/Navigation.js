import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import classnames from "classnames";
import { navToggle } from "../../actions/navbarActions";
// Iconos
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { RiSettings5Line } from "react-icons/ri";
import { MdGames } from "react-icons/md";

export class Navigation extends Component {
  toggle = () => {
    this.props.navToggle();
  };

  render() {
    const { pathname } = this.props.history.location;
    return (
      <div
        className={classnames("navigation", {
          visible: this.props.navbar.visible,
        })}
      >
        <div
          className={classnames("bg", {
            visible: this.props.navbar.visible,
          })}
          onClick={this.toggle}
        ></div>
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
            to="/profile"
            className={classnames({
              selected: pathname == "/profile",
            })}
          >
            <AiOutlineUser /> Perfil
          </Link>
          <Link
            to="/configurations"
            className={classnames({
              selected: pathname == "/configurations",
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

export default connect(mapStateToProps, { navToggle })(withRouter(Navigation));
