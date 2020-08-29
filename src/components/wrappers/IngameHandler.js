import React, { Component } from "react";
import { connect } from "react-redux";

export class IngameHandler extends Component {
  render() {
    console.log("ingame handler");
    return null;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(IngameHandler);
