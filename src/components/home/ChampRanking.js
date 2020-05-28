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
              <div key={i} className="ranking__element">
                <div className="ranking__lane">
                  <img src={icon_dict[key.toLowerCase()]} /> <span>{key}</span>
                </div>

                <Link
                  to={`/champions/${ranking[key].championId}`}
                  className="ranking__info"
                >
                  <img
                    className="ranking__img"
                    src={getLoading(img_links, champ_data.key)}
                  />
                  <div className="ranking__overlay"></div>
                  <div className="ranking__text">
                    <div className="ranking__champ">
                      {ranking[key].champName}
                    </div>
                    <div className="ranking__winrate">
                      {ranking[key].winRate.toFixed(2)} %
                      <div className="ranking__winrate_text">Winrate</div>
                    </div>
                  </div>
                </Link>
              </div>
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
