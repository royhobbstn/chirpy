/* global fetch */

import { loadInitialData } from "./actions.js";

export function thunkLoadInitialData() {
  return (dispatch, getState) => {
    return fetch("http://localhost:8081/getData", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        key: window.localStorage.getItem("access_token_key"),
        secret: window.localStorage.getItem("access_token_secret")
      })
    })
      .then(response => response.json())
      .then(response => {
        dispatch(loadInitialData(response));
      });
  };
}
