import React, { Component } from "react";

export class ListStat extends Component {
  render() {
    var { value, title, color } = this.props;
    color = color ? `championlist__stat__fill--${color}` : "";

    return (
      <div className="championlist__stat">
        <div className="championlist__stat__bar">
          <div
            className={`championlist__stat__fill ${color}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <div className="championlist__stat__name">{title}</div>
        <div className="championlist__stat__value">{value} %</div>
      </div>
    );
  }
}

export default ListStat;
