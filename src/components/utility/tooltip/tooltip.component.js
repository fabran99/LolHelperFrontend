import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";

import "./tooltip.styles.scss";

const BACKGROUND = "#151618";

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    color: "white",
    border: "none",
    fontFamily: "Poppins",
    background: BACKGROUND,
  },
  arrow: {
    color: BACKGROUND,
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
