import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { icon_dict } from "../../helpers/iconDict";
import { getLoading } from "../../helpers/getImgLinks";
import {
  selectImgLinks,
  selectRanking,
} from "../../redux/assets/assets.selectors";
import { selectChampionById } from "../../redux/assets/assets.selectors";

const ChampRanking = ({ ranking, img_links, getChampionById }) => {
  if (!ranking) {
    return null;
  }

  var lines = Object.keys(ranking);

  return (
    <div className="ranking">
      <div className="ranking__title header_text">
        Top de campeones por línea
      </div>
      <div className="ranking__list">
        {lines.map((key, i) => {
          var champ_data = getChampionById(ranking[key].championId);
          if (!champ_data) {
            return null;
          }
          return (
            <Link
              key={key}
              className="detailcard"
              to={`/#${champ_data.championId}`}
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
                    className={`lane__icon lane__icon--${key.toLowerCase()}`}
                  >
                    <img src={icon_dict[key.toLowerCase()]} alt="" />
                  </div>
                  <div className="lane__name">{key}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  ranking: selectRanking(state),
  img_links: selectImgLinks(state),
  getChampionById: (id) => selectChampionById(id)(state),
});

export default connect(mapStatetoProps, null)(ChampRanking);
