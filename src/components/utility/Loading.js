import React, { Component } from "react";
import logo from "../../img/logoLoading.png";

export class Loading extends Component {
  render() {
    return (
      <div className="loading_container fadeIn">
        <div class="text" id="text">
          Cargando...
        </div>
        <img src={logo} alt="" />
      </div>
    );
  }
}

export default Loading;
