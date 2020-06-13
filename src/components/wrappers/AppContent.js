import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import bg from "../../img/universe-bg.jpg";

export class AppContent extends Component {
  render() {
    const { navbar, extraclass } = this.props;
    return (
      <div
        className={classnames("app_content", {
          nav_visible: navbar.visible,
          [extraclass]: extraclass ? extraclass : false,
        })}
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  navbar: state.navbar,
});

export default connect(mapStatetoProps, null)(AppContent);
