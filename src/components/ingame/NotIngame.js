import React, { Component } from "react";

export class NotIngame extends Component {
  render() {
    return (
      <div className="NotIngame">
        <div className="NotIngame__text">
          No te encuentras en seleccion de campeón, empieza a jugar para ver
          información en tiempo real desde la selección de campeón.
        </div>
      </div>
    );
  }
}

export default NotIngame;
