import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// Selectors
import {
  selectChampionsAsDict,
  selectImgLinks,
} from "../../../redux/assets/assets.selectors";
// Utilidades
import { icon_dict } from "../../../helpers/iconDict";
import { getSquare } from "../../../helpers/getImgLinks";

const RankingElement = ({ data, lane, champions, imgLinks, index }) => {
  const currentChamp = champions[data.championId];

  return (
    <Link
      to={`/champions/${data.championId}`}
      className={`element element--${lane.toLowerCase()}`}
    >
      <div className="element__content">
        <div className="row">
          <div className="col-4">
            <div className="icon">
              <div className="icon__container">
                <img
                  src={getSquare(imgLinks, currentChamp.key)}
                  className="champ_icon"
                />
              </div>
              <div className={`icon__lanecontainer ${lane.toLowerCase()}`}>
                <img
                  src={icon_dict[lane.toLowerCase()]}
                  className="lane_icon"
                />
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="element__info">
              <div className="element__name">
                {currentChamp.name} <small>{lane}</small>
              </div>
              <div className="element__winrate">
                WR: <small>{data.winRate} %</small>
              </div>
              <div className="element__banrate">
                BR: <small>{currentChamp.banRate} %</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const mapStateToProps = (state) => ({
  champions: selectChampionsAsDict(state),
  imgLinks: selectImgLinks(state),
});

export default connect(mapStateToProps, null)(RankingElement);
