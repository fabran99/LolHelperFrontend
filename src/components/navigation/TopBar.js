import React, { Component } from "react";
import { connect } from "react-redux";
import { navToggle } from "../../actions/navbarActions";
import { electronWindow } from "../../helpers/outsideObjects";

export class TopBar extends Component {
  minimize = () => {
    electronWindow.minimize();
  };
  close = () => {
    electronWindow.close();
  };

  toggleNav = () => {
    this.props.navToggle();
  };

  render() {
    return (
      <div className="top_bar">
        {this.props.assets.champions && (
          <div className="navbar_toggle" onClick={this.toggleNav}>
            <i className="fas fa-bars"></i>
          </div>
        )}

        <div className="icons">
          <i className="fas fa-window-minimize" onClick={this.minimize}></i>
          <i className="fas fa-times" onClick={this.close}></i>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  navbar: state.navbar,
  assets: state.assets,
});

export default connect(mapStateToProps, { navToggle })(TopBar);
