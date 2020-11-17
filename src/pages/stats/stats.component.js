import React from "react";
// Componentes
import PageWrapper from "../../wrappers/pageWrapper/pageWrapper.component";
import RevealWithTimeout from "../../wrappers/revealWithTimeout/revealWithTimeout.component";
import Ranking from "../../components/ranking/ranking.component";
import ChampionList from "../../components/championList/championList.component";

import akaliBG from "../../img/backgrounds/akaliBG.jpg";

import "./stats.styles.scss";

const StatsPage = () => {
  return (
    <PageWrapper background={akaliBG}>
      <RevealWithTimeout seconds={0.2}>
        <div className="title">Estadísticas</div>
      </RevealWithTimeout>

      <div className="row">
        <div className="col-8">
          <RevealWithTimeout seconds={0.3}>
            <ChampionList />
          </RevealWithTimeout>
        </div>
        <div className="col-4">
          <RevealWithTimeout seconds={0.4}>
            <Ranking />
          </RevealWithTimeout>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StatsPage;
