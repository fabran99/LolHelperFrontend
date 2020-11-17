import React from "react";
import { minimize, close } from "../../../electron/nativeActions";

import "./rightbar.styles.scss";

const RightBar = (props) => {
  return (
    <div className="rightbar">
      <div className="rightbar__icons">
        <div className="icon" onClick={minimize}>
          <i className="fas fa-window-minimize"></i>
        </div>
        <div className="icon" onClick={close}>
          <i className="fas fa-times"></i>
        </div>
      </div>

      <div className="rightbar__content">
        <span></span>
      </div>
    </div>
  );
};

export default RightBar;
