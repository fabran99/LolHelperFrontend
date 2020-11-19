import React from "react";
// Componentes
import PageWrapper from "../../wrappers/pageWrapper/pageWrapper.component";
import Ranking from "../../components/ranking/ranking.component";
import ChampionList from "../../components/championList/championList.component";

import akaliBG from "../../img/backgrounds/akaliBG.jpg";

import "./stats.styles.scss";

const StatsPage = () => {
  return (
    <PageWrapper background={akaliBG}>
      <div className="title">Estadísticas</div>

      <div className="row">
        <div className="col-8">
          <ChampionList />
        </div>
        <div className="col-4">
          <Ranking />
        </div>
      </div>
    </PageWrapper>
  );
};

export default StatsPage;
