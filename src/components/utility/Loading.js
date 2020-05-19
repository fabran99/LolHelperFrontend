import React, { Component } from "react";

export class Loading extends Component {
  render() {
    return (
      <div className="loading_container">
        <div className="loading">
          <div className="loading__animation">Cargando...</div>
        </div>
      </div>
    );
  }
}

export default Loading;
