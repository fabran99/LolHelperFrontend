import React, { Component } from "react";
import CustomTooltip from "./CustomTooltip";

export class Tag extends Component {
  render() {
    const { tooltip, value, type } = this.props;
    return (
      <CustomTooltip placement="top" title={tooltip}>
        <div className={`tag tag--${type}`}>{value}</div>
      </CustomTooltip>
    );
  }
}

export default Tag;
