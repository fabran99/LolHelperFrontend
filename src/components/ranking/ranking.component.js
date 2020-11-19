import React from "react";
import { connect } from "react-redux";

// Selectors
import { selectRanking } from "../../redux/assets/assets.selectors";
// Componentes
import RevealWithTimeout from "../../wrappers/revealWithTimeout/revealWithTimeout.component";
import RankingElement from "./subcomponents/RankingElement";

import "./ranking.styles.scss";

const Ranking = ({ ranking }) => {
  return (
    <div className="ranking">
      <div className="subtitle">Ranking por línea</div>
      <div className="ranking__content">
        <div className="ranking__list">
          {Object.keys(ranking).map((lane, index) => {
            var data = ranking[lane];
            return (
              <RevealWithTimeout seconds={0.1 * index} key={lane}>
                <RankingElement data={data} lane={lane} />
              </RevealWithTimeout>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ranking: selectRanking(state),
});

export default connect(mapStateToProps, null)(Ranking);
