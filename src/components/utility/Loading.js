import React, { Component } from "react";

export class Loading extends Component {
  render() {
    return (
      <div className="loading_container">
        <div className="loading">
          <div className="loading__text">Cargando...</div>
          <div className="loading__bar">
            <div className="loading__fill"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Loading;
