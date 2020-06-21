import React, { Component } from "react";
import { connect } from "react-redux";
import { getLoading, getSquare, getSpell } from "../../helpers/getImgLinks";
import { spellsFromChamp } from "../../functions/assetParser";
import CustomTooltip from "../utility/CustomTooltip";
import { Link } from "react-router-dom";
import { getCurrentPlayer } from "../../functions/gameSession";

export class ChampImage extends Component {
  getChampInfo(id) {
    const { assets } = this.props;
    if (!id) {
      return null;
    }

    var champ = assets.champions.find((item) => item.championId == id);
    return champ;
  }

  getCurrentPlayer() {
    const { champSelect } = this.props;
    return getCurrentPlayer(champSelect);
  }

  render() {
    const { champ, assets } = this.props;

    // Si estoy en seleccion detecto la skin que tenga puesta el jugador

    return (
      <div>
        <div className="detailcard detailcard--visible">
          <div className="detailcard__border"></div>
          <div className="detailcard__background">
            <img src={getLoading(assets.img_links, champ.key)} alt="" />
          </div>
          <div className="detailcard__overlay"></div>

          <div className="detailcard__text">
            <div className="name">{champ.name}</div>
            <div className="title">{champ.title}</div>
            <div className="summoners">
              {spellsFromChamp(champ, assets).map((spell, i) => {
                return (
                  <CustomTooltip
                    key={spell.id}
                    placement="top"
                    title={
                      <div className="tooltip">
                        <div className="tooltip__title">{spell.name}</div>
                        <div className="tooltip__content">
                          {spell.description}
                        </div>
                        <div className="tooltip__subcontent">
                          Cooldown: {spell.cooldown}s
                        </div>
                      </div>
                    }
                  >
                    <div className="spell">
                      <div className="image">
                        <img src={getSpell(assets.img_links, spell.id)} />
                      </div>
                    </div>
                  </CustomTooltip>
                );
              })}
            </div>
          </div>
        </div>

        <div className="counters">
          <div className="counters__border"></div>
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
                          <div className="tooltip__content">
                            {enemyInfo.name}
                          </div>
                        </div>
                      }
                    >
                      <Link
                        className="image"
                        to={`/champion/${enemy.championId}`}
                      >
                        <img src={getSquare(assets.img_links, enemyInfo.key)} />
                      </Link>
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
                          <div className="tooltip__content">
                            {enemyInfo.name}
                          </div>
                        </div>
                      }
                    >
                      <Link
                        className="image  image--hard"
                        to={`/champion/${enemy.championId}`}
                      >
                        <img src={getSquare(assets.img_links, enemyInfo.key)} />
                      </Link>
                    </CustomTooltip>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
  champSelect: state.lcuConnector.champSelect,
});

export default connect(mapStateToProps, null)(ChampImage);
