import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";

export class AppContent extends Component {
  render() {
    const { navbar, extraclass } = this.props;
    return (
      <div
        className={classnames("app_content", {
          nav_visible: navbar.visible,
          [extraclass]: extraclass ? extraclass : false,
        })}
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
