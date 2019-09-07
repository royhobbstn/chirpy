import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppContainer from "./AppContainer";
import { runAuthentication } from "./Service/authentication";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { thunkLoadInitialData } from "./Redux/thunks";
import Store from "./Redux/combine_reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  Store,
  composeEnhancers(applyMiddleware(thunk))
);

runAuthentication()
  .then(async result => {
    if (result === true) {
      store.dispatch(thunkLoadInitialData());
    }
  })
  .catch(err => {
    console.log(err);
  });

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
