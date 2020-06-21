import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "rgb(7, 27, 49)",
    color: "white",
    border: "none",
  },
}))(Tooltip);

export class CustomTooltip extends Component {
  render() {
    const { arrow, placement, title, children } = this.props;
    return (
      <HtmlTooltip title={title} arrow={arrow} placement={placement}>
        {children}
      </HtmlTooltip>
    );
  }
}

export default CustomTooltip;
