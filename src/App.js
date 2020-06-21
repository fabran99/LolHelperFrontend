import React, { Component } from "react";
import Particles from "react-particles-js";
import particles_config from "./json/particlesjs-config.json";
// Redux
import { Provider } from "react-redux";
import store from "./store";
// React router
import { HashRouter as Router, Route, Switch } from "react-router-dom";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componentes
import AppWrapper from "./components/wrappers/AppWrapper";
import Home from "./components/home/Home";
import Ingame from "./components/ingame/Ingame";

// Navegacion
import TopBar from "./components/navigation/TopBar";

// css
import "./css/main.css";

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <ToastContainer />
            <Particles params={particles_config} />
            <TopBar />

            <AppWrapper>
              <div className="app_wrapper">
                <Switch>
                  {/* Homepage */}
                  <Route
                    exact
                    path="/"
                    render={(props) => <Home {...props} />}
                  />
                  {/* Ingame */}
                  <Route
                    exact
                    path="/ingame"
                    render={(props) => <Ingame {...props} />}
                  />

                  {/* 404 */}
                  <Route render={(props) => <Home {...props} />} />
                </Switch>
              </div>
            </AppWrapper>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
