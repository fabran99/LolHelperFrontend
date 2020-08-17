import React, { Component } from "react";
import { connect } from "react-redux";
import { getSquare } from "../../helpers/getImgLinks";

import CustomTooltip from "../utility/CustomTooltip";
import { Link } from "react-router-dom";

export class CountersList extends Component {
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  render() {
    const { assets, champ } = this.props;

    return (
      <div className="counters">
        <div className="counters__section">
          <div className="counters__title">Fuerte contra</div>
          <div className="counters__list">
            {champ.strongAgainst.map((enemy, i) => {
              var enemyInfo = this.getChampInfo(enemy);
              return (
                <div className="counters__list__champ" key={enemyInfo.key}>
                  <CustomTooltip
                    placement="top"
                    title={
                      <div className="tooltip">
                        <div className="tooltip__content">{enemyInfo.name}</div>
                      </div>
                    }
                  >
                    <div className="image" to={`/champion/${enemy.championId}`}>
                      <img src={getSquare(assets.img_links, enemyInfo.key)} />
                    </div>
                  </CustomTooltip>
                </div>
              );
            })}
          </div>
        </div>
        <div className="counters__section">
          <div className="counters__title">Debil contra</div>
          <div className="counters__list">
            {champ.weakAgainst.map((enemy, i) => {
              var enemyInfo = this.getChampInfo(enemy);
              return (
                <div className="counters__list__champ" key={enemyInfo.key}>
                  <CustomTooltip
                    placement="top"
                    title={
                      <div className="tooltip">
                        <div className="tooltip__content">{enemyInfo.name}</div>
                      </div>
                    }
                  >
                    <div
                      className="image  image--hard"
                      to={`/champion/${enemy.championId}`}
                    >
                      <img src={getSquare(assets.img_links, enemyInfo.key)} />
                    </div>
                  </CustomTooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(CountersList);
