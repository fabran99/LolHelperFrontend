import React, { Component } from "react";

export class ListStat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({
        value: this.props.value,
      });
    }, 50);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidUpdate() {
    if (this.props.value != this.state.value) {
      this.setState({
        value: this.props.value,
      });
    }
  }

  render() {
    var { title, color } = this.props;
    var { value } = this.state;
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
