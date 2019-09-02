import React from 'react';
import reactStringReplace from "react-string-replace";

function App({data}) {
  return (
    <div>
      {data.map(generateTweet)}
    </div>
  );
}

export default App;


function generateTweet(tweet) {

  const linkedTweet = replaceLinks(tweet);

  return <div className="card container"><p className="container">
  <span className="bold">@{tweet.user.screen_name}&nbsp;&nbsp;</span>
  {linkedTweet}
  </p></div>;
}


function replaceLinks(tweet) {

  const tweet_copy = JSON.parse(JSON.stringify(tweet));

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
    // full_text = full_text.replace(k, <a href={key[k].expanded} target="_blank">${key[k].display}</a>);
    full_text = reactStringReplace(full_text, k, (match, i) => (
      <a href={key[k].expanded} target="_blank">{key[k].display}</a>
    ));
  });

  Object.keys(media_key).forEach(k => {

    const media_url_array = media_key[k].media_url.split(".");
    const extension = media_url_array.pop();
    const ext_query = extension === "jpeg" || extension === "jpg" ? "jpg" : "png";
    const removed_type = media_url_array.join(".");

    const append_querystring = `${removed_type}?format=${ext_query}&name=small`;
    const append_querystring_lg = `${removed_type}?format=${ext_query}&name=large`;

    full_text = reactStringReplace(full_text, k, (match, i) => (
        <React.Fragment><br />
          <div className="image-container">
            <a href={append_querystring_lg} target="_blank">
              <img src={append_querystring} alt={"Embedded " + media_key[k].type} />
            </a>
          </div>
        </React.Fragment>
    ));

  });

  return full_text;

}


