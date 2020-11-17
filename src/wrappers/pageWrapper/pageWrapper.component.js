import React from "react";
import "./pageWrapper.styles.scss";

const PageWrapper = ({ children, background }) => {
  var styles = {
    backgroundImage: background ? `url("${background}")` : null,
  };
  return (
    <div className="page_wrapper" style={styles}>
      <div className="page_overlay"></div>
      <div className="page_content">{children}</div>
    </div>
  );
};

export default PageWrapper;
