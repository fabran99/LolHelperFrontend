import React from "react";
// Componentes
import PageWrapper from "../../wrappers/pageWrapper/pageWrapper.component";
import RevealWithTimeout from "../../wrappers/revealWithTimeout/revealWithTimeout.component";

import bardBG from "../../img/backgrounds/bardBG.jpg";

import "./home.styles.scss";

const HomePage = () => {
  return (
    <PageWrapper background={bardBG}>
      <RevealWithTimeout seconds={0.2}>
        <div className="title">Bard App</div>
      </RevealWithTimeout>
    </PageWrapper>
  );
};

export default HomePage;
