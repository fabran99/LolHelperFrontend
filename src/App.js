import React, { Component } from "react";
import Particles from "react-particles-js";
import particles_config from "./json/particlesjs-config.json";
// Redux
import { Provider } from "react-redux";
import store from "./store";
// React router
import { HashRouter as Router, Route, Switch } from "react-router-dom";

// Componentes
import AppWrapper from "./components/wrappers/AppWrapper";
import Home from "./components/home/Home";

// Navegacion
import Navigation from "./components/navigation/Navigation";
import TopBar from "./components/navigation/TopBar";

// css
import "./css/main.css";

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Particles params={particles_config} />
            <TopBar />

            <AppWrapper>
              <Navigation />

              <div className="app_wrapper">
                <Switch>
                  {/* Homepage */}
                  <Route
                    exact
                    path="/"
                    render={(props) => <Home {...props} />}
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
