import React, { Component } from "react";
import { connect } from "react-redux";
import { updateConfig } from "../../redux/settings/settings.actions";
import { withRouter } from "react-router-dom";
import Switch from "../utility/Switch";
import { electron } from "../../helpers/outsideObjects";
import classnames from "classnames";
import bg from "../../img/universe-bg.jpg";
import { selectLcuConnection } from "../../redux/lcuConnector/lcuConnector.selectors";
import { handleSelectFolder } from "../../electron/nativeActions";

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
    this.props.updateConfig({ settingsVisible: false });
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

  escFunction(event) {
    if (event.keyCode === 27) {
      this.closeModal();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction.bind(this), false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction.bind(this), false);
  }

  render() {
    const { connection, settings } = this.props;

    const { autoNavigate, autoImportRunes, autoAcceptMatch, autoImportBuild } =
      settings;

    const { restartingUx } = this.state;

    const handleLeaguePath = (e) => {
      e.preventDefault();
      handleSelectFolder(settings.gamePath).then((res) => {
        if (res) {
          console.log(res);
          this.props.updateConfig({ gamePath: res });
        }
      });
    };

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
                {/* Automaticas */}
                <div className="col-6">
                  <div className="configuration__section">
                    <div className="configuration__title">
                      Acciones automáticas
                    </div>

                    <label className="configuration__element configuration__element--switch">
                      <Switch
                        name="autoNavigate"
                        checked={autoNavigate}
                        onChange={this.updateConfig.bind(this)}
                      />
                      <div className="configuration__element__name">
                        Mostrar pestaña Ingame al iniciar la selección o la
                        partida.
                      </div>
                    </label>

                    <label className="configuration__element configuration__element--switch">
                      <Switch
                        name="autoImportRunes"
                        checked={autoImportRunes}
                        onChange={this.updateConfig.bind(this)}
                      />
                      <div className="configuration__element__name">
                        Importar runas automáticamente al confirmar campeón.
                      </div>
                    </label>
                    <label className="configuration__element configuration__element--switch">
                      <Switch
                        name="autoImportBuild"
                        checked={autoImportBuild}
                        onChange={this.updateConfig.bind(this)}
                      />
                      <div className="configuration__element__name">
                        Importar build automáticamente al confirmar campeón.
                      </div>
                    </label>
                    <label className="configuration__element configuration__element--switch">
                      <Switch
                        name="autoAcceptMatch"
                        checked={autoAcceptMatch}
                        onChange={this.updateConfig.bind(this)}
                      />
                      <div className="configuration__element__name">
                        Aceptar partida automáticamente.
                      </div>
                    </label>
                    <label className="configuration__element configuration__element--button">
                      <div className="configuration__element__name configuration__element__name--block">
                        Ruta de instalacion de League of Legends.
                      </div>
                      <button
                        className="configuration__button configuration__button--select"
                        onClick={handleLeaguePath.bind(this)}
                      >
                        <div className="configuration__button__border"></div>
                        {settings.gamePath}
                      </button>
                    </label>
                  </div>
                </div>

                {/* Manuales */}
                <div className="col-6">
                  {connection && (
                    <div className="configuration__section">
                      <div className="configuration__title">
                        Acciones manuales
                      </div>
                      <div className="configuration__element configuration__element--button">
                        <div className="configuration__element__name configuration__element__name--block ">
                          Resolucion de problemas
                        </div>

                        <button
                          className={classnames("configuration__button", {
                            "configuration__button--disabled": restartingUx,
                          })}
                          onClick={this.restartUx.bind(this)}
                        >
                          <div className="configuration__button__border"></div>
                          Refrescar interfaz del launcher
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
  settings: state.settings,
  connection: selectLcuConnection(state),
});

const mapDispatchToProps = {
  updateConfig,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Configuration));
