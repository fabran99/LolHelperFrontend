import React from "react";
import LeftBar from "./leftbar/leftbar.component";
import TopBar from "./topbar/topbar.component";
import RightBar from "./rightbar/rightbar.component";

const Navigation = () => (
  <React.Fragment>
    <LeftBar />
    <RightBar />
    <TopBar />
  </React.Fragment>
);

export default Navigation;
