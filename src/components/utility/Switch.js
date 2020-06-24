import React, { Component } from "react";
import classnames from "classnames";

export class Switch extends Component {
  render() {
    const { name, checked, onChange } = this.props;
    return (
      <label
        className={classnames("switch", {
          "switch--checked": checked,
        })}
      >
        <div className="icon">
          <span></span>
          <span></span>
        </div>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
        />
      </label>
    );
  }
}

export default Switch;
