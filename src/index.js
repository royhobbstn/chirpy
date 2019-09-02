import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {runAuthentication} from "./Service/authentication";
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { thunkLoadInitialData} from "./Redux/thunks";
import Store from './Redux/combine_reducers';


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  Store,
  composeEnhancers(
    applyMiddleware(thunk),
  )
);

/* global URLSearchParams fetch */

runAuthentication()
  .then(async ()=> {

    store.dispatch(thunkLoadInitialData());

    // const data = await getData();
    //
    // console.log(data);
    //
    // const inject = data.map(generateTweet).join('');
    //
    // document.body.innerHTML = inject;
    //
    // console.log(inject);
  })
  .catch(err => {
    console.log(err);
  });


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


function generateTweet(tweet) {

  const linkedTweet = replaceLinks(tweet);

  return `<div class="card container"><p class="container">
  
  <span class="bold">@${linkedTweet.user.screen_name}</span>
  
  ${linkedTweet.full_text}
  
  
  </p></div>
  
  
  `;
}

function replaceLinks(tweet) {

  const tweet_copy = JSON.parse(JSON.stringify(tweet));

  // console.log(JSON.stringify(tweet))

  let full_text = tweet_copy.full_text;

  const key = {};
  const media_key = {};

  // create a text replace system using url indices
  tweet.entities.urls.forEach(url => {
    const text = Array.from(tweet.full_text).slice(url.indices[0], url.indices[1]).join('');
    key[text] = { expanded: url.expanded_url, display: url.display_url };
  });

  tweet.entities.media && tweet.entities.media.forEach(item => {
    const text = Array.from(tweet.full_text).slice(item.indices[0], item.indices[1]).join('');
    media_key[text] = { media_url: item.media_url_https, type: item.type };
  });

  Object.keys(key).forEach(k => {
    full_text = full_text.replace(k, `<a href="${key[k].expanded}" target="_blank">${key[k].display}</a>`);
  });

  Object.keys(media_key).forEach(k => {

    const media_url_array = media_key[k].media_url.split(".");
    const extension = media_url_array.pop();
    const ext_query = extension === "jpeg" || extension === "jpg" ? "jpg" : "png";
    const removed_type = media_url_array.join(".");

    const append_querystring = `${removed_type}?format=${ext_query}&name=small`;
    const append_querystring_lg = `${removed_type}?format=${ext_query}&name=large`;

    full_text = full_text.replace(k, `<br /><div class="image-container"><a href="${append_querystring_lg}" target="_blank"><img src="${append_querystring}" alt="Embedded ${media_key[k].type}" /></a></div>`);
  });

  tweet_copy.full_text = full_text;

  return tweet_copy;
}
