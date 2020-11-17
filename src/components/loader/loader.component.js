import React from "react";
import logo from "../../img/logos/logoLoading.png";

import "./loader.styles.scss";

const Loader = () => (
  <div className="loader">
    <div className="loader__content">
      <img src={logo} alt="" />
      <div className="loader__text">Cargando</div>
    </div>
  </div>
);

export default Loader;
