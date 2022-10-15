import React from "react";
import { connect } from "react-redux";
import CustomTooltip from "../../utility/CustomTooltip";

import {
  selectImgLinks,
  selectSpells,
} from "../../../redux/assets/assets.selectors";
import { getSpell } from "../../../helpers/getImgLinks";

const SummonerSpell = (props) => {
  const { imgLinks, spellId, spells } = props;
  const spellData = spells.find((item) => item.key == spellId);
  if (!spellData) {
    return (
      <div className="summonerSpell">
        <div className="spell">
          <div className="image"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="summonerSpell">
      <CustomTooltip
        key={spellData.id}
        placement="top"
        title={
          <div className="tooltip">
            <div className="tooltip__title tooltip__title--image">
              <img src={getSpell(imgLinks, spellData.id)} />
              <span>{spellData.name}</span>{" "}
            </div>
            <div className="tooltip__content">{spellData.description}</div>
            <div className="tooltip__subcontent">
              Cooldown: {spellData.cooldown}s
            </div>
          </div>
        }
      >
        <div className="spell">
          <div className="image">
            <img src={getSpell(imgLinks, spellData.id)} />
          </div>
        </div>
      </CustomTooltip>
    </div>
  );
};

const mapStateToProps = (state) => ({
  imgLinks: selectImgLinks(state),
  spells: selectSpells(state),
});

export default connect(mapStateToProps, null)(SummonerSpell);
