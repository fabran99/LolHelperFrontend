import React, { Component } from "react";
import classnames from "classnames";
import baronIcon from "../../img/baronIcon.png";

const BaronStatus = ({ baronStatus }) => {
  return (
    <div className="baron_status">
      <div
        className={classnames("baron_status__state", {
          "baron_status__state--alive": baronStatus == null,
        })}
      >
        {baronStatus == null ? "Vivo" : baronStatus}
      </div>

      <div
        className={classnames("baron_status__icon", {
          "baron_status__icon--alive": baronStatus == null,
        })}
      >
        <img src={baronIcon} />
      </div>
    </div>
  );
};

export default BaronStatus;
