import React, { Component } from "react";
import { connect } from "react-redux";
import CustomTooltip from "../utility/CustomTooltip";
import { runesFromChamp } from "../../functions/assetParser";

export class RuneList extends Component {
  render() {
    const { assets, champ, lane } = this.props;

    var current_lane = lane;

    if (!current_lane || champ.lanes.indexOf(current_lane) == -1) {
      current_lane = champ.lanes[0];
    }

    var working_runes = runesFromChamp(champ, assets, current_lane);

    return (
      <div className="runes">
        <div
          className={`runeList runeList--${working_runes.primaryRune.key.toLowerCase()} runeList__primary`}
        >
          <div className="rune">
            <div className="title">{working_runes.primaryRune.name}</div>
            <div className="image">
              <img src={working_runes.primaryRune.image} alt="" />
            </div>
          </div>
          {working_runes.primaryPerks.map((perk, i) => {
            return (
              <CustomTooltip
                key={perk.id}
                placement="top"
                title={
                  <div className="tooltip">
                    <div className="tooltip__title tooltip__title--image">
                      <img className="noround" src={perk.image} alt="" />{" "}
                      <span>{perk.name}</span>
                    </div>
                    <div className="tooltip__content">{perk.description}</div>
                  </div>
                }
              >
                <div className="rune">
                  <div className="image">
                    <img src={perk.image} alt="" />
                  </div>
                </div>
              </CustomTooltip>
            );
          })}
        </div>
        <div className="runeListSecondary">
          <div
            className={`runeList runeList--${working_runes.secondaryRune.key.toLowerCase()} runeList__secondary`}
          >
            <div className="rune">
              <div className="title">{working_runes.secondaryRune.name}</div>
              <div className="image">
                <img src={working_runes.secondaryRune.image} alt="" />
              </div>
            </div>

            {working_runes.secondaryPerks.map((perk, i) => {
              return (
                <CustomTooltip
                  key={perk.id}
                  placement="top"
                  title={
                    <div className="tooltip">
                      <div className="tooltip__title tooltip__title--image">
                        <img className="noround" src={perk.image} alt="" />{" "}
                        <span>{perk.name}</span>
                      </div>
                      <div className="tooltip__content">{perk.description}</div>
                    </div>
                  }
                >
                  <div className="rune">
                    <div className="image">
                      <img src={perk.image} alt="" />
                    </div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
          <div className="runeList runeList__perks">
            {working_runes.perkList.map((perk, i) => {
              return (
                <CustomTooltip
                  key={`${perk.id}_${i}`}
                  title={
                    <div className="tooltip">
                      <div className="tooltip__content">{perk.description}</div>
                    </div>
                  }
                  placement="top"
                >
                  <div className="perk">
                    <div className="image">
                      <img src={perk.image} alt="" />
                    </div>
                  </div>
                </CustomTooltip>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  assets: state.assets,
});

export default connect(mapStateToProps, null)(RuneList);
