import React, { Component } from "react";

export class ListStat extends Component {
  render() {
    var { value, title, color } = this.props;
    color = color ? `barstat__fill--${color}` : "";

    return (
      <div className="barstat">
        <div className="barstat__bar">
          <div
            className={`barstat__fill ${color}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <div className="barstat__name">{title}</div>
        <div className="barstat__value">{value} %</div>
      </div>
    );
  }
}

export default ListStat;
