import React, { Component } from "react";
import { connect } from "react-redux";
import img_placeholder from "../../img/placeholder.svg";
import { getSquare } from "../../helpers/getImgLinks";
import { Link } from "react-router-dom";
import { icon_dict } from "../../helpers/iconDict";
import classnames from "classnames";
import ListStat from "./ListStat";

export class ListRow extends Component {
  render() {
    const { champ, i, lockChamp, assets, current_champ } = this.props;
    const { img_links } = assets;

    return (
      <div
        className={classnames("championlist__element", {
          "championlist__element--active": champ.championId == current_champ,
        })}
        onClick={lockChamp.bind(this, champ.championId)}
      >
        <div className="championlist__number">{i + 1}</div>
        <div className="championlist__icon">
          <img
            className="championlist__img__preloader"
            src={img_placeholder}
          ></img>
          <img src={getSquare(img_links, champ.key)} alt={champ.name} />
        </div>
        <div className="championlist__info">
          <Link
            to={`/champion/${champ.championId}`}
            className="championlist__name"
          >
            {champ.name}
          </Link>
          <div className="championlist__lane">
            <img src={icon_dict[champ.lane.toLowerCase()]} />
            <span>{champ.lane}</span>
          </div>
        </div>
        <div className="championlist__stats">
          <ListStat value={champ.high_elo_winrate} title="Winrate" />
          <ListStat
            value={champ.high_elo_banrate}
            title="Banrate"
            color="pink"
          />
          <ListStat
            value={champ.high_elo_pickrate}
            title="Pickrate"
            color="green"
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});
export default connect(mapStateToProps, null)(ListRow);
