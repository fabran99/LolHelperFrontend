import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getLoading, getItem, getSpell } from "../../helpers/getImgLinks";
import Tooltip from "@material-ui/core/Tooltip";

export class ChampionDetail extends Component {
  render() {
    const { champ_data, assets, build, working_runes, spells } = this.props;
    const { img_links } = assets;
    return (
      <div className="championdetail">
        <Link
          to={`/champion/${champ_data.championId}`}
          className="championdetail__img"
        >
          <img src={getLoading(img_links, champ_data.key)} />
        </Link>
        {/* Spells */}
        <div className="spells">
          {spells.map((spell, i) => {
            return (
              <Tooltip
                key={spell.key}
                arrow
                title={
                  <div className="spelltooltip">
                    <div className="spelltooltip__name">{spell.name}</div>
                    <div className="spelltooltip__desc">
                      {spell.description}
                    </div>
                    <div className="spelltooltip__desc">
                      Cooldown: {spell.cooldown}
                    </div>
                  </div>
                }
                placement="top"
              >
                <div className="spells__item">
                  <img src={getSpell(img_links, spell.id)} />
                </div>
              </Tooltip>
            );
          })}
        </div>
        {/* <div className="championdetail__sectionname">Runas</div> */}
        <div className="runes">
          {/* runas principales */}
          {working_runes && (
            <div className="runes__primary">
              <Tooltip
                arrow
                title={
                  <div className="runetooltip">
                    <div className="runetooltip__name runetooltip__name--unique">
                      {working_runes.primaryRune.name}
                    </div>
                  </div>
                }
                placement="top"
              >
                <div className="runes__primary__first--inline">
                  <img src={working_runes.primaryRune.image} alt="" />
                </div>
              </Tooltip>
              {/* perks runas principales */}
              {working_runes.primaryPerks.map((perk, i) => {
                if (i == 0) {
                  return (
                    <Tooltip
                      key={perk.id}
                      arrow
                      title={
                        <div className="runetooltip">
                          <div className="runetooltip__name">{perk.name}</div>
                          <div className="runetooltip__desc">
                            {perk.description}
                          </div>
                        </div>
                      }
                      placement="top"
                    >
                      <div className="runes__primary__perk--inline">
                        <img src={perk.image} alt="" />
                      </div>
                    </Tooltip>
                  );
                }
                return (
                  <Tooltip
                    key={perk.id}
                    arrow
                    title={
                      <div className="runetooltip">
                        <div className="runetooltip__name">{perk.name}</div>
                        <div className="runetooltip__desc">
                          {perk.description}
                        </div>
                      </div>
                    }
                    placement="top"
                  >
                    <div className="runes__primary__perk ">
                      <img src={perk.image} />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}
          {/* runas secundarias */}
          {working_runes && (
            <div className="runes__secondary">
              <Tooltip
                arrow
                title={
                  <div className="runetooltip">
                    <div className="runetooltip__name runetooltip__name--unique">
                      {working_runes.secondaryRune.name}
                    </div>
                  </div>
                }
                placement="top"
              >
                <div className="runes__secondary__first">
                  <img src={working_runes.secondaryRune.image} />
                </div>
              </Tooltip>
              {/* Perks runas secundarias */}
              {working_runes.secondaryPerks.map((perk, i) => {
                return (
                  <Tooltip
                    arrow
                    key={`${perk.id}_${i}`}
                    title={
                      <div className="runetooltip">
                        <div className="runetooltip__name">{perk.name}</div>
                        <div className="runetooltip__desc">
                          {perk.description}
                        </div>
                      </div>
                    }
                    placement="top"
                  >
                    <div className="runes__secondary__perk">
                      <img src={perk.image} alt="" />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}
          {/* Perks */}
          {working_runes && (
            <div className="runes__perks">
              {working_runes.perkList.map((perk, i) => {
                return (
                  <Tooltip
                    arrow
                    key={`${perk.id}_${i}`}
                    title={
                      <div className="runetooltip">
                        <div className="runetooltip__name runetooltip__name--unique">
                          {perk.description}
                        </div>
                      </div>
                    }
                    placement="top"
                  >
                    <div className="runes__secondary__perk">
                      <img src={perk.image} alt="" />
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </div>
        {/* Build */}
        <div className="build build--notop">
          {/* <div className="championdetail__sectionname">Build</div> */}
          {build &&
            build.map((item, i) => {
              return (
                <Tooltip
                  arrow
                  key={item.id}
                  title={
                    <div className="buildtooltip">
                      <div className="buildtooltip__name">{item.name}</div>

                      <div className="buildtooltip__desc">
                        {item.description}
                      </div>
                      <div className="buildtooltip__price">
                        Precio: {item.price}
                      </div>
                    </div>
                  }
                >
                  <div className="build__item">
                    <img src={getItem(img_links, item.id)} alt="" />
                  </div>
                </Tooltip>
              );
            })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(ChampionDetail);
