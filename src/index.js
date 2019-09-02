import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


/* global URLSearchParams fetch */

const logExcluded = true;

main();

async function main() {
  const currentToken1 = window.localStorage.getItem('oauth_token');
  const currentToken2 = window.localStorage.getItem('oauth_token_secret');
  const currentToken3 = window.localStorage.getItem('oauth_verifier');

  if (!currentToken1 || !currentToken2) {

    // get app oauth tokens
    await fetch("http://localhost:8081/api/getAuthTokens")
      .then(res => res.json())
      .then(response => {
        console.log(response);
        // {"oauth_token":"","oauth_token_secret":"","oauth_callback_confirmed":"true"}
        window.localStorage.setItem('oauth_token', response.oauth_token);
        window.localStorage.setItem('oauth_token_secret', response.oauth_token_secret);
        window.location = `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // this will run when redirect process appends querystring to url
  if (currentToken1 && currentToken2 && !currentToken3) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('oauth_token') && urlParams.has('oauth_verifier')) {
      if (urlParams.get('oauth_token') === currentToken1) {
        window.localStorage.setItem('oauth_verifier', urlParams.get('oauth_verifier'));
      }
    }
  }

  const oauthVerifier = window.localStorage.getItem('oauth_verifier');
  const currentToken4 = window.localStorage.getItem('access_token_key');
  const currentToken5 = window.localStorage.getItem('access_token_secret');
  const currentToken6 = window.localStorage.getItem('user_id');
  const currentToken7 = window.localStorage.getItem('screen_name');

  if(oauthVerifier && (!currentToken4 || !currentToken5 || !currentToken6 || !currentToken7)) {
    // get user access tokens
    await fetch("http://localhost:8081/api/getAccessTokens", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
        key: window.localStorage.getItem('oauth_token'),
        secret: window.localStorage.getItem('oauth_token_secret'),
        verifier: window.localStorage.getItem('oauth_verifier')
      })
    })
      .then(response => response.json())
      .then( response => {
        console.log(response);
        window.localStorage.setItem('access_token_key', response.accTkn);
        window.localStorage.setItem('access_token_secret', response.accTknSecret);
        window.localStorage.setItem('user_id', response.userId);
        window.localStorage.setItem('screen_name', response.screenName);
      });

  }

  if(oauthVerifier && currentToken4 && currentToken5 && currentToken6 && currentToken7) {

    // if here, then must have all tokens
    const data = await getData();

    console.log(data);

    const inject = data.map(generateTweet).join('');

    document.body.innerHTML = inject;

    console.log(inject);

  }


}


function getData() {

  return fetch("http://localhost:8081/api/getData", {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      key: window.localStorage.getItem('access_token_key'),
      secret: window.localStorage.getItem('access_token_secret')
    })
  })
    .then(response => response.json())
    .then( response => {
      return response;
    });

}




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
