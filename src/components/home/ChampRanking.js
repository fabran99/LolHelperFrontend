import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { icon_dict } from "../../helpers/iconDict";
import { getLoading } from "../../helpers/getImgLinks";

export class ChampRanking extends Component {
  render() {
    const { assets } = this.props;
    if (!assets.ranking) {
      return null;
    }

    var { ranking, champions, img_links } = assets;
    var lines = Object.keys(ranking);

    return (
      <div className="ranking">
        <div className="ranking__title header_text">
          Top de campeones por línea
        </div>
        <div className="ranking__list">
          {lines.map((key, i) => {
            var champ_data = champions.find(
              (item) => item.championId == ranking[key].championId
            );
            if (!champ_data) {
              return null;
            }
            return (
              <Link
                key={key}
                to={`/champions/${ranking[key].championId}`}
                className="detailcard"
              >
                <div className="detailcard__border"></div>
                <div className="detailcard__background">
                  <img src={getLoading(img_links, champ_data.key)} alt="" />
                </div>
                <div className="detailcard__overlay"></div>

                <div className="detailcard__text">
                  <div className="name">{champ_data.name}</div>
                  <div className="title title--percent">
                    {ranking[key].winRate.toFixed(2)} % <small>WinRate</small>
                  </div>
                  <div className="lane">
                    <div
                      className={`lane__icon lane__icon--${champ_data.lane.toLowerCase()}`}
                    >
                      <img
                        src={icon_dict[champ_data.lane.toLowerCase()]}
                        alt=""
                      />
                    </div>
                    <div className="lane__name">{champ_data.lane}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStatetoProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStatetoProps, null)(ChampRanking);
