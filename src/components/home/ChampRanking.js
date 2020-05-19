import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { icon_dict } from "../../helpers/iconDict";

export class ChampRanking extends Component {
  render() {
    const { assets } = this.props;
    if (!assets.general.content) {
      return null;
    }

    var { ranking, main_list } = assets.general.content;
    var lines = Object.keys(ranking);

    return (
      <div className="ranking">
        <div className="ranking__title header_text">
          Top de campeones por línea
        </div>
        <div className="ranking__list">
          {lines.map((key, i) => {
            var champ_data = main_list.find(
              (item) => item.championId == ranking[key].champId
            );
            return (
              <Link
                to={`/champions/${ranking[key].champId}`}
                key={i}
                className="ranking__element"
              >
                <div className="ranking__lane">
                  <img src={icon_dict[key.toLowerCase()]} /> <span>{key}</span>
                </div>

                <div className="ranking__info">
                  <img
                    className="ranking__img"
                    src={champ_data.images.loading}
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
