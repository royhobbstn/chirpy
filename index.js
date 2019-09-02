const express = require('express');
const path = require('path');
const Twitter = require('twitter-lite');
const app = express();
const cors = require('cors');

app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// An api endpoint that returns a short list of items
app.get('/api/getOauthTokens', async(req, res) => {

  const client = new Twitter({
    consumer_key: "YOfoLwfwjdP95KfbODGD9z2QW",
    consumer_secret: "EtB2F4NTFIiLn3Pcgqgxu1It8GlmXxvfRxN5uOxBFuXaKhrl63"
  });

  await client
    .getRequestToken("https://79a58373baf9444b9a578583c17ba4be.vfs.cloud9.us-west-2.amazonaws.com/")
    .then(response => {
      res.status(200).send(response);
    });
});


const port = 8081;
app.listen(port);

console.log('App is listening on port ' + port);
