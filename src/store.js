import { createStore, applyMiddleware, compose } from "redux";
import { persistStore } from "redux-persist";

import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};

const middleware = [thunk];

var store;
if (process.env.NODE_ENV == "development") {
  try {
    store = createStore(
      rootReducer,
      initialState,
      //  en caso de que no esté instalada la extension de redux comentar
      //las siguientes 3 lineas y descomentar la otra
      compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    );
  } catch {
    {
      store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
      );
    }
  }
} else {
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
}

const persistor = persistStore(store);

export default { store, persistor };
