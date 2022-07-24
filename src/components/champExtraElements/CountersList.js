import React, { Component } from "react";
import { connect } from "react-redux";
import { getSquare } from "../../helpers/getImgLinks";

import CustomTooltip from "../utility/CustomTooltip";
import { Link } from "react-router-dom";
import {
  selectChampionById,
  selectImgLinks,
} from "../../redux/assets/assets.selectors";

const CountersList = ({ getChampionById, imgLinks, champ }) => {
  return (
    <div className="counters">
      <div className="counters__section">
        <div className="counters__title">Fuerte contra</div>
        <div className="counters__list">
          {champ.strongAgainst.map((enemy, i) => {
            var enemyInfo = getChampionById(enemy.championId);
            return (
              <div className="counters__list__champ" key={enemyInfo.key}>
                <CustomTooltip
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__content">
                        {enemyInfo.name}{" "}
                        <div>
                          <small>{enemy.winRate.toFixed(2)}% WinRate</small>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="image" to={`/champion/${enemy.championId}`}>
                    <img src={getSquare(imgLinks, enemyInfo.key)} />
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
            var enemyInfo = getChampionById(enemy.championId);
            return (
              <div className="counters__list__champ" key={enemyInfo.key}>
                <CustomTooltip
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__content tooltip__content--center">
                        {enemyInfo.name}{" "}
                        <div>
                          <small>{enemy.winRate.toFixed(2)}% WinRate</small>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div
                    className="image  image--hard"
                    to={`/champion/${enemy.championId}`}
                  >
                    <img src={getSquare(imgLinks, enemyInfo.key)} />
                  </div>
                </CustomTooltip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  assets: state.assets,
  getChampionById: (id) => selectChampionById(id)(state),
  imgLinks: selectImgLinks(state),
});

export default connect(mapStateToProps, null)(CountersList);
