const express = require('express');
const path = require('path');
const Twitter = require('twitter-lite');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));


app.get('/api/getAuthTokens', async(req, res) => {

  const client = new Twitter({
    consumer_key: "YOfoLwfwjdP95KfbODGD9z2QW",
    consumer_secret: "EtB2F4NTFIiLn3Pcgqgxu1It8GlmXxvfRxN5uOxBFuXaKhrl63"
  });

  client
      .getRequestToken("http://localhost:3000/")
      .then(response => {
        console.log('getAuthTokens');
        console.log(response);
        res.status(200).send(response);
      })
    .catch(e=> {
    console.log(e);
    res.status(500).send(e);
  });

});

app.post('/api/getAccessTokens', async(req, res) => {

  const client = new Twitter({
    consumer_key: "YOfoLwfwjdP95KfbODGD9z2QW",
    consumer_secret: "EtB2F4NTFIiLn3Pcgqgxu1It8GlmXxvfRxN5uOxBFuXaKhrl63"
  });

  console.log('getAccessTokens');
  console.log('req.body');
  console.log(req.body);

  client
    .getAccessToken({
      key: req.body.key,
      secret: req.body.secret,
      verifier: req.body.verifier
    })
    .then(response => {
      const info = {
        accTkn: response.oauth_token,
        accTknSecret: response.oauth_token_secret,
        userId: response.user_id,
        screenName: response.screen_name
      };
      console.log(info);
      res.status(200).send(info);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.post('/api/getData', async(req, res) => {

  const logExcluded = true;

  console.log('getData');
  console.log('req.body');
  console.log(req.body);

  const client = new Twitter({
    consumer_key: "YOfoLwfwjdP95KfbODGD9z2QW",
    consumer_secret: "EtB2F4NTFIiLn3Pcgqgxu1It8GlmXxvfRxN5uOxBFuXaKhrl63",
    access_token_key: req.body.key,
    access_token_secret: req.body.secret
  });

  return client
    .get('statuses/home_timeline', { count: 200, tweet_mode: 'extended' })
    .then(response => {

      const json = response
        .filter(tweet => {
          const hasLink = tweet.full_text.includes('https'); // tweet.entities.urls[0] &&  - to eliminate image-only tweets
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

      res.status(200).send(json);

    })
    .catch(error => {
      console.log(error);
      res.status(500).send([])
    });

});

const port = 8081;
app.listen(port);

console.log('App is listening on port ' + port);
