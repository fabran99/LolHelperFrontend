import React, { Component } from "react";
import { connect } from "react-redux";
import { updateConfig } from "../../actions/configActions";
import { withRouter } from "react-router-dom";
import Switch from "../utility/Switch";
import { electron } from "../../helpers/outsideObjects";
import classnames from "classnames";
import bg from "../../img/universe-bg.jpg";

export class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restartingUx: false,
    };
  }
  updateConfig(e) {
    const { updateConfig } = this.props;
    var value = e.target.checked;
    var variable = e.target.name;
    updateConfig({ [variable]: value });
  }

  closeModal() {
    this.props.updateConfig({ configurationVisible: false });
  }

  restartUx() {
    const { connection } = this.props;
    this.setState({
      restartingUx: true,
    });
    electron.ipcRenderer
      .invoke("RESTART_UX", JSON.stringify({ connection }))
      .then((res) => {
        this.setState({
          restartingUx: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          restartingUx: false,
        });
      });
  }

  render() {
    const { connection, configuration } = this.props;

    const {
      autoNavigate,
      autoImportRunes,
      autoAcceptMatch,
      autoImportBuild,
    } = configuration;

    const { restartingUx } = this.state;

    return (
      <div className="modal modal--forward">
        <div
          className="modal__background"
          onClick={this.closeModal.bind(this)}
        ></div>

        <div
          className="modal__content"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <div className="modal__close" onClick={this.closeModal.bind(this)}>
            <i className="fas fa-times"></i>
          </div>

          <div className="modal__bar">Opciones</div>

          <div className="modal__content_data">
            <div className="configuration">
              <div className="row">
                <div className="col-6">
                  <div className="configuration__section">
                    <div className="configuration__title">
                      Acciones automáticas
                    </div>
                    <div className="configuration__element">
                      <Switch
                        name="autoNavigate"
                        checked={autoNavigate}
                        onChange={this.updateConfig.bind(this)}
                      />
                      <div className="configuration__element__name">
                        Mostrar pestaña Ingame al iniciar la selección o la
                        partida.
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
                <div className="col-6">
                  {connection && (
                    <div className="configuration__section">
                      <div className="configuration__title">
                        Acciones manuales
                      </div>
                      <div className="configuration__element configuration__element--button">
                        <div className="configuration__element__name configuration__element__name--block ">
                          Reiniciar interfaz del launcher (para cuando se
                          cuelga)
                        </div>

                        <button
                          className={classnames("configuration__button", {
                            "configuration__button--disabled": restartingUx,
                          })}
                          onClick={this.restartUx.bind(this)}
                        >
                          <div className="configuration__button__border"></div>
                          Aplicar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  configuration: state.configuration,
  connection: state.lcuConnector.connection,
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Configuration));
