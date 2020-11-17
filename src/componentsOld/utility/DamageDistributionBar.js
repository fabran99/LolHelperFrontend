import React, { Component } from "react";

export class DamageDistributionBar extends Component {
  render() {
    const { ap, ad } = this.props;
    return (
      <div className="barstat">
        <div className="barstat__bar">
          <div
            className={`barstat__fill barstat__fill--abs no_round__right`}
            style={{ width: `${ap}%` }}
          ></div>
          <div
            className={`barstat__fill barstat__fill--abs no_round__left barstat__fill--pink`}
            style={{ width: `${ad}%` }}
          ></div>
        </div>
        <div className="barstat__title barstat__title--right">
          <div className="pinkText">{`${ad}%`} AD</div>
        </div>
        <div className="barstat__title barstat__title--left">
          <div className="blueText">{`${ap}%`} AP</div>
        </div>
      </div>
    );
  }
}

export default DamageDistributionBar;
