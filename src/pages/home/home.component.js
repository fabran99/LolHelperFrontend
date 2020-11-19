import React from "react";
// Componentes
import PageWrapper from "../../wrappers/pageWrapper/pageWrapper.component";

import bardBG from "../../img/backgrounds/bardBG.jpg";

import "./home.styles.scss";

const HomePage = () => {
  return (
    <PageWrapper background={bardBG}>
      <div className="title">Bard App</div>
    </PageWrapper>
  );
};

export default HomePage;
