import React, { Component } from "react";

export class AppContent extends Component {
  render() {
    return <div className="app_content">{this.props.children}</div>;
  }
}

export default AppContent;
