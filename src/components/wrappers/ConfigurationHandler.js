import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateConfig } from "../../actions/configActions";
import { toast } from "react-toastify";
import { electron } from "../../helpers/outsideObjects";

export class ConfigurationHandler extends Component {
  componentDidMount() {
    this.initListeners();
  }

  initListeners() {
    const {
      lcuDisconnect,
      lcuConnect,
      champselectchange,
      gamesessionChange,
      lobbyChange,
    } = this.props;
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  lcuConnector: state.lcuConnector,
  configuration: state.configuration,
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ConfigurationHandler));
