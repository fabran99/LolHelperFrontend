import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";

export class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { assets, navbar } = this.props;

    return (
      <div
        className={classnames("app_content home_page", {
          nav_visible: navbar.visible,
        })}
      >
        <h1>homepage</h1>
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  navbar: state.navbar,
});

export default connect(mapStatetoProps, null)(Home);
