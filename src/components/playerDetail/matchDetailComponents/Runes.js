import React from "react";
import { connect } from "react-redux";
import CustomTooltip from "../../utility/CustomTooltip";

import { selectItemsAsDict } from "../../../redux/assets/assets.selectors";
import {
  selectRunes,
  selectPerks,
} from "../../../redux/assets/assets.selectors";

const Runes = (props) => {
  const { runeData, runes } = props;
  let perkPrimaryStyle = runeData.primary.main;
  let perkSecondaryStyle = runeData.secondary.main;
  let perkData = runes.find((rune) => rune.id === perkPrimaryStyle);
  let perkDataSecondary = runes.find((rune) => rune.id === perkSecondaryStyle);
  let perk0 = perkData.slots.find((slot) => slot.id === runeData.primary.perk0);
  let perk1 = perkData.slots.find((slot) => slot.id === runeData.primary.perk1);
  let perk2 = perkData.slots.find((slot) => slot.id === runeData.primary.perk2);
  let perk3 = perkData.slots.find((slot) => slot.id === runeData.primary.perk3);

  let perk4 = perkDataSecondary.slots.find(
    (slot) => slot.id === runeData.secondary.perk4
  );
  let perk5 = perkDataSecondary.slots.find(
    (slot) => slot.id === runeData.secondary.perk5
  );

  console.log(props);

  return (
    <div className="team__runes">
      <CustomTooltip
        placement="top"
        title={
          <div className="tooltip">
            <div className="tooltip__content tooltip__content--big">
              <div className="runes">
                <div
                  className={`runeList runeList--${perkData?.key.toLowerCase()} runeList__primary`}
                >
                  <div className="rune">
                    <div className="title">{perkData?.name}</div>
                    <div className="image">
                      <img src={perkData?.image} />
                    </div>
                  </div>
                  <div className="rune">
                    <div className="image">
                      <img src={perk0?.image} />
                    </div>
                  </div>
                  <div className="rune">
                    <div className="image">
                      <img src={perk1?.image} />
                    </div>
                  </div>
                  <div className="rune">
                    <div className="image">
                      <img src={perk2?.image} />
                    </div>
                  </div>
                  <div className="rune">
                    <div className="image">
                      <img src={perk3?.image} />
                    </div>
                  </div>
                </div>

                <div className="runeListSecondary">
                  <div
                    className={`runeList runeList--${perkDataSecondary?.key.toLowerCase()} runeList__secondary`}
                  >
                    <div className="rune">
                      <div className="title">{perkDataSecondary?.name}</div>
                      <div className="image">
                        <img src={perkDataSecondary?.image} />
                      </div>
                    </div>
                    <div className="rune">
                      <div className="image">
                        <img src={perk4?.image} />
                      </div>
                    </div>
                    <div className="rune">
                      <div className="image">
                        <img src={perk5?.image} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <img src={perk0?.image} />
      </CustomTooltip>
    </div>
  );
};

const mapStateToProps = (state) => ({
  runes: selectRunes(state),
  perks: selectPerks(state),
});

export default connect(mapStateToProps, null)(Runes);
