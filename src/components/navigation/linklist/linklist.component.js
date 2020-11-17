import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import "./linklist.styles.scss";

const LinkList = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className="linklist">
      <div className="linklist__content">
        {data.map((item, i) => {
          return (
            <Link
              key={i}
              to={item.to}
              className={classnames("link", {
                "link--active": item.active,
              })}
            >
              <div className="link__content">{item.content}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default LinkList;
