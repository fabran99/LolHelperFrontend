import React from "react";
import { withRouter } from "react-router-dom";
import LinkList from "../linklist/linklist.component";

import "./leftbar.styles.scss";

const LINK_DATA = [
  {
    to: "/",
    content: <i className="fas fa-home"></i>,
  },
  {
    to: "/stats",
    content: <i className="fas fa-chart-area"></i>,
  },
  {
    to: "/ingame",
    content: <i className="fas fa-gamepad"></i>,
  },
  {
    to: "/settings",
    content: <i className="fas fa-sliders-h"></i>,
  },
];

const LeftBar = (props) => {
  const { pathname } = props.history.location;

  var data = LINK_DATA.map((el) => {
    return {
      ...el,
      active: pathname == el.to,
    };
  });

  return (
    <div className="leftbar">
      <div className="leftbar__main">
        <LinkList data={data} />
      </div>
    </div>
  );
};

export default withRouter(LeftBar);
