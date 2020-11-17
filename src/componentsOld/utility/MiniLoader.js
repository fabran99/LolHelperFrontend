import React, { Component } from "react";

export class MiniLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
    };
  }
  componentDidMount() {
    this.timeoutHide = setTimeout(() => {
      this.setState({ hide: true });
    }, 10 * 1000);
  }

  componentWillUnmount() {
    if (this.timeoutHide) {
      clearTimeout(this.timeoutHide);
    }
  }

  render() {
    const { hide } = this.state;
    if (hide) {
      return null;
    }
    return (
      <div className="miniloader">
        <div className="circle"></div>
      </div>
    );
  }
}

export default MiniLoader;
