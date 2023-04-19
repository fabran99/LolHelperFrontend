import React from "react";
import { connect } from "react-redux";

import { updateConfig } from "../../redux/settings/settings.actions";

import ChampImage from "../champSelectionElements/ChampImage";
import TeamsList from "../champSelectionElements/TeamsList";

import Loading from "../utility/Loading";
import { selectGameName } from "../../redux/gameSession/gameSession.selectors";
import {
  selectSelectedChamp,
  selectChampSelectionValid,
} from "../../redux/champSelect/champSelect.selectors";
import { selectChampionById } from "../../redux/assets/assets.selectors";

const ChampSelect = ({
  champSelectionValid,
  gameName,
  getChampionById,
  selectedChamp,
}) => {
  if (!champSelectionValid) {
    return <Loading />;
  }

  var champ = getChampionById(selectedChamp);
  return (
    <div className="champSelect">
      <div className="header_text header_text--long">{gameName}</div>
      <div className="row">
        {/* Imagen */}
        <div className="col-3">
          <div className="champSelect__image">
            <ChampImage champ={champ} />
          </div>
        </div>

        {/* Teams */}
        <div className="col-9">
          <TeamsList alone={!champ} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameName: selectGameName(state),
  getChampionById: (id) => selectChampionById(id)(state),
  selectedChamp: selectSelectedChamp(state),
  champSelectionValid: selectChampSelectionValid(state),
});

export default connect(mapStateToProps, { updateConfig })(ChampSelect);
