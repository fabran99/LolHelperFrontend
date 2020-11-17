import React, { Component } from "react";
import { icon_dict } from "../../helpers/iconDict";
import CustomTooltip from "./CustomTooltip";

export class LaneRateStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
  }
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ height: this.props.height });
    }, 200);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.height != this.props.height) {
      this.setState({ height: this.props.height });
    }
  }

  render() {
    const { lane, laneWinrate } = this.props;
    const { height } = this.state;

    var icon = icon_dict[lane.toLowerCase()];

    const tooltipData = () => {
      return (
        <div className="tooltip">
          <div className="tooltip__title">{lane}</div>
          <div className="tooltip__content">
            WinRate: <div className="value">{laneWinrate} %</div>
          </div>
          <div className="tooltip__content">
            PlayRate: <div className="value">{height} %</div>
          </div>
        </div>
      );
    };

    return (
      <CustomTooltip title={tooltipData()} placement="top">
        <div className="lane_element">
          <div className="lane_element__bar">
            <div
              style={{ height: `${height}%` }}
              className="lane_element__fill"
            ></div>
          </div>
          <div className="lane_element__icon">
            <img src={icon} alt="" />
          </div>
        </div>
      </CustomTooltip>
    );
  }
}

export default LaneRateStat;
