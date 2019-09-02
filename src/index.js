import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Twitter from 'twitter-lite';

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

    // get oauth tokens

    await fetch("/api/getAuthTokens")
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

  if (currentToken1 && currentToken2 && !currentToken3) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('oauth_token') && urlParams.has('oauth_verifier')) {
      if (urlParams.get('oauth_token') === currentToken1) {
        window.localStorage.setItem('oauth_verifier', urlParams.get('oauth_verifier'));
      }
    }
  }

  // get access tokens
  const user = new Twitter({
    consumer_key: "YOfoLwfwjdP95KfbODGD9z2QW",
    consumer_secret: "EtB2F4NTFIiLn3Pcgqgxu1It8GlmXxvfRxN5uOxBFuXaKhrl63"
  });

  user
    .getAccessToken({
      key: window.localStorage.getItem('oauth_token'),
      secret: window.localStorage.getItem('oauth_token_secret'),
      verifier: window.localStorage.getItem('oauth_verifier')
    })
    .then(res => {
      console.log({
        accTkn: res.oauth_token,
        accTknSecret: res.oauth_token_secret,
        userId: res.user_id,
        screenName: res.screen_name
      });
    })
    .catch(err => {
      console.log(err);
    });

  const data = await getData(user);

  const inject = data.map(generateTweet).join('');

  document.body.innerHTML = inject;

  console.log(inject);

}


function getData(user) {

  return user
    .get('statuses/home_timeline', { count: 200, tweet_mode: 'extended' })
    .then(response => {

      return response
        .filter(tweet => {
          const hasLink = tweet.entities.urls[0] && tweet.full_text.includes('https');
          if (!hasLink && logExcluded) {
            console.log(`EXCLUDED - NO LINKS: ${tweet.full_text}`);
          }
          return hasLink;
        })
        .filter(tweet => {
          const isTwitterLink = tweet.entities.urls[0] && tweet.entities.urls[0].expanded_url.includes('twitter.com');
          if (isTwitterLink && logExcluded) {
            console.log(`EXCLUDED - TWITTER INTERNAL LINK: ${tweet.full_text} ${tweet.entities.urls[0].expanded_url}`);
          }
          return !isTwitterLink;
        })
        .filter(tweet => {
          const isTwitterLink = tweet.entities.urls[0] && tweet.entities.urls[0].expanded_url.includes('instagram.com');
          if (isTwitterLink && logExcluded) {
            console.log(`EXCLUDED - INSTAGRAM LINK: ${tweet.full_text} ${tweet.entities.urls[0].expanded_url}`);
          }
          return !isTwitterLink;
        })
        .map(tweet => {
          return {
            id_str: tweet.id_str,
            full_text: tweet.full_text,
            truncated: tweet.truncated,
            entities: tweet.entities,
            user: {
              id_str: tweet.user.id_str,
              name: tweet.user.name,
              screen_name: tweet.user.screen_name
            }
          };

        });

    })
    .catch(error => {
      console.log(error);
      return [];
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
