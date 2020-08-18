import React, { Component } from "react";
import { connect } from "react-redux";
import { updateConfig } from "../../actions/configActions";
import AppContent from "../wrappers/AppContent";
import Switch from "../utility/Switch";

export class Configuration extends Component {
  updateConfig(e) {
    const { updateConfig } = this.props;
    var value = e.target.checked;
    var variable = e.target.name;
    updateConfig({ [variable]: value });
  }

  render() {
    const {
      autoNavigate,
      autoImportRunes,
      autoAcceptMatch,
      autoImportBuild,
    } = this.props.configuration;

    return (
      <AppContent>
        <div className="configuration">
          <div className="row">
            <div className="col-6">
              <div className="configuration__section">
                <div className="configuration__title">Acciones automáticas</div>
                <div className="configuration__element">
                  <Switch
                    name="autoNavigate"
                    checked={autoNavigate}
                    onChange={this.updateConfig.bind(this)}
                  />
                  <div className="configuration__element__name">
                    Mostrar pestaña InGame al iniciar la selección o la partida.
                  </div>
                </div>
                <div className="configuration__element">
                  <Switch
                    name="autoImportRunes"
                    checked={autoImportRunes}
                    onChange={this.updateConfig.bind(this)}
                  />
                  <div className="configuration__element__name">
                    Importar runas automáticamente al confirmar campeón.
                  </div>
                </div>
                <div className="configuration__element">
                  <Switch
                    name="autoImportBuild"
                    checked={autoImportBuild}
                    onChange={this.updateConfig.bind(this)}
                  />
                  <div className="configuration__element__name">
                    Importar build automáticamente al confirmar campeón.
                  </div>
                </div>
                <div className="configuration__element">
                  <Switch
                    name="autoAcceptMatch"
                    checked={autoAcceptMatch}
                    onChange={this.updateConfig.bind(this)}
                  />
                  <div className="configuration__element__name">
                    Aceptar partida automáticamente.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppContent>
    );
  }
}

const mapStateToProps = (state) => ({
  configuration: state.configuration,
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
