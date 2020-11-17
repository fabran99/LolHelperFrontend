import React, { Component } from "react";
import classnames from "classnames";
import drakeIcon from "../../img/drakeIcon.png";
import elderDrakeIcon from "../../img/elderDrakeIcon.png";

export class DrakeStatus extends Component {
  render() {
    const { drakeStatus } = this.props;

    return (
      <div
        className={classnames("drake_status", {
          "drake_status--elder": drakeStatus.isElder,
        })}
      >
        <div
          className={classnames("drake_status__icon", {
            "drake_status__icon--alive": drakeStatus.timeLeft == null,
          })}
        >
          <img src={drakeStatus.isElder ? elderDrakeIcon : drakeIcon} />
        </div>
        <div
          className={classnames("drake_status__state", {
            "drake_status__state--alive": drakeStatus.timeLeft == null,
            "drake_status__state--elder": drakeStatus.isElder,
          })}
        >
          {drakeStatus.timeLeft == null ? "Vivo" : drakeStatus.timeLeft}
        </div>
      </div>
    );
  }
}

export default DrakeStatus;
