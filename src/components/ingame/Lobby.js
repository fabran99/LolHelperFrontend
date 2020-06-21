import React, { Component } from "react";
import { connect } from "react-redux";

export class Lobby extends Component {
  render() {
    return (
      <div className="lobby">
        <div className="header_text ">En el lobby</div>
        <div className="teams">
          <div className="team">
            <div className="team__title">
              <h1>Equipos</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
});
export default connect(mapStateToProps, null)(Lobby);
