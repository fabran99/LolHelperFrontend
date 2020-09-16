import React, { Component } from "react";
import { connect } from "react-redux";
import img_placeholder from "../../img/placeholder.svg";
import { getSquare } from "../../helpers/getImgLinks";
import { Link } from "react-router-dom";
import { icon_dict } from "../../helpers/iconDict";
import classnames from "classnames";
import BarRateStat from "../utility/BarRateStat";
import { getWinrate } from "../../helpers/general";

export class ListRow extends Component {
  render() {
    const {
      champ,
      i,
      lockChamp,
      assets,
      current_champ,
      lane,
      changeLane,
    } = this.props;
    const { img_links } = assets;

    var winrate = getWinrate(champ, lane);
    var tipowinrate = !lane ? "(Global)" : `(${lane})`;

    const winRateContent = () => {
      return (
        <span>
          Winrate <small>{tipowinrate}</small>
        </span>
      );
    };

    return (
      <div
        className={classnames("championlist__element", {
          "championlist__element--active": champ.championId == current_champ,
        })}
        onClick={lockChamp.bind(this, champ.championId)}
      >
        <div className="championlist__number">{i + 1}</div>
        <span
          className="championlist__icon"
          to={`/champion/${champ.championId}`}
        >
          <img
            className="championlist__img__preloader"
            src={img_placeholder}
          ></img>
          <img src={getSquare(img_links, champ.key)} alt={champ.name} />
        </span>
        <div className="championlist__info">
          <span
            to={`/champion/${champ.championId}`}
            className="championlist__name"
          >
            {champ.name}
          </span>
          <div className="championlist__lane">
            {champ.info_by_lane.map((laneinfo) => {
              return (
                <span
                  key={laneinfo.lane}
                  onClick={changeLane.bind(this, laneinfo.lane)}
                >
                  <img src={icon_dict[laneinfo.lane.toLowerCase()]} />
                  <span>{laneinfo.lane}</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="championlist__stats">
          <BarRateStat value={winrate} title={winRateContent()} />
          <BarRateStat value={champ.banRate} title="Banrate" color="pink" />
          <BarRateStat value={champ.pickRate} title="Pickrate" color="green" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});
export default connect(mapStateToProps, null)(ListRow);
