import React, { Component } from "react";
import { Provider } from "react-redux";
import storeObject from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

// React router
import { HashRouter as Router, Route, Switch } from "react-router-dom";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Paginas
import HomePage from "./pages/home/home.component";
import StatsPage from "./pages/stats/stats.component";

// Componentes
import Navigation from "./components/navigation/navigation.component";
import AppWrapper from "./wrappers/AppWrapper/AppWrapper.component";

// Sass
import "./sass/bootstrap-grid.min.css";
import "./sass/main.scss";

export class App extends Component {
  render() {
    return (
      <Provider store={storeObject.store}>
        <Router>
          <PersistGate persistor={storeObject.persistor}>
            <div className="App">
              <ToastContainer />

              {/* Navegacion */}
              <Navigation />

              <AppWrapper>
                <div className="app_container">
                  <Switch>
                    {/* HomePage */}
                    <Route
                      exact
                      path="/"
                      render={(props) => <HomePage {...props} />}
                    />
                    {/* StatsPage */}
                    <Route
                      exact
                      path="/stats"
                      render={(props) => <StatsPage {...props} />}
                    />
                    {/* <Route
                    exact
                    path="/"
                    render={(props) => <Home {...props} />}
                  /> */}
                    {/* Ingame */}
                    {/* <Route
                    exact
                    path="/ingame"
                    render={(props) => <Ingame {...props} />}
                  /> */}
                    {/* Configuration */}
                    {/* <Route
                    exact
                    path="/configuration"
                    render={(props) => <Configuration {...props} />}
                  /> */}

                    {/* 404 */}
                    {/* <Route render={(props) => <Home {...props} />} /> */}
                  </Switch>
                </div>
              </AppWrapper>
            </div>
          </PersistGate>
        </Router>
      </Provider>
    );
  }
}

export default App;
