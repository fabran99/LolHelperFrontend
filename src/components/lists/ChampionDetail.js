import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getLoading } from "../../helpers/getImgLinks";
import { icon_dict } from "../../helpers/iconDict";

export class ChampionDetail extends Component {
  render() {
    const { champ_data, assets, build } = this.props;
    const { img_links } = assets;

    return (
      <div className="championdetail">
        <Link to={`/champion/${champ_data.key}`} className="detailcard">
          <div className="detailcard__border"></div>
          <div className="detailcard__background">
            <img src={getLoading(img_links, champ_data.key)} alt="" />
          </div>
          <div className="detailcard__overlay"></div>

          <div className="detailcard__text">
            <div className="name">{champ_data.name}</div>
            <div className="title">{champ_data.title}</div>
            <div className="lane">
              <div
                className={`lane__icon lane__icon--${champ_data.lane.toLowerCase()}`}
              >
                <img src={icon_dict[champ_data.lane.toLowerCase()]} alt="" />
              </div>
              <div className="lane__name">{champ_data.lane}</div>
            </div>
          </div>
        </Link>
        <div className="championdetail__lore">{champ_data.lore}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(ChampionDetail);
