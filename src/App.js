import React from "react";
import reactStringReplace from "react-string-replace";
import MenuContainer from "./MenuContainer";
import he from "he";

function App({ data }) {
  return (
    <div>
      <MenuContainer />
      {data.map(generateTweet)}
    </div>
  );
}

export default App;

function generateTweet(tweet) {
  const linkedTweet = replaceLinks(tweet);

  return (
    <div key={tweet.id_str} className="card container">
      <div className="buffer">
        <span className="main-alias" title={tweet.user.name}>
          @{tweet.user.screen_name}&nbsp;&nbsp;
        </span>
        <pre>{linkedTweet}</pre>
      </div>
    </div>
  );
}

function replaceLinks(tweet) {
  const tweet_copy = JSON.parse(JSON.stringify(tweet));

  let full_text = tweet_copy.full_text;

  const key = {};
  const media_key = {};
  const mentions = {};
  const hashtags = {};

  // create a text replace system using url indices
  tweet.entities.urls.forEach(url => {
    const text = Array.from(tweet.full_text)
      .slice(url.indices[0], url.indices[1])
      .join("");
    key[text] = { expanded: url.expanded_url, display: url.display_url };
  });

  tweet.entities.media &&
    tweet.entities.media.forEach(item => {
      const text = Array.from(tweet.full_text)
        .slice(item.indices[0], item.indices[1])
        .join("");
      media_key[text] = { media_url: item.media_url_https, type: item.type };
    });

  tweet.entities.user_mentions &&
    tweet.entities.user_mentions.forEach(item => {
      const text = Array.from(tweet.full_text)
        .slice(item.indices[0], item.indices[1])
        .join("");
      mentions[text] = item.name;
    });

  tweet.entities.hashtags &&
    tweet.entities.hashtags.forEach(item => {
      const text = Array.from(tweet.full_text)
        .slice(item.indices[0], item.indices[1])
        .join("");
      hashtags[text] = true;
    });

  full_text = he.decode(full_text);

  Object.keys(key).forEach(k => {
    full_text = reactStringReplace(full_text, k, (match, i) => (
      <a
        href={key[k].expanded}
        key={k}
        target="_blank"
        rel="noopener noreferrer"
      >
        {key[k].display}
      </a>
    ));
  });

  Object.keys(media_key).forEach(k => {
    const media_url_array = media_key[k].media_url.split(".");
    const extension = media_url_array.pop();
    const ext_query =
      extension === "jpeg" || extension === "jpg" ? "jpg" : "png";
    const removed_type = media_url_array.join(".");

    const append_querystring_lg = `${removed_type}?format=${ext_query}&name=large`;

    full_text = reactStringReplace(full_text, k, (match, i) => (
      <a
        key={k}
        style={{ display: "block", paddingTop: "10px" }}
        href={append_querystring_lg}
        target="_blank"
        rel="noopener noreferrer"
      >
        &#128247;{" "}
        {removed_type.length > 29
          ? removed_type.slice(0, 26) + "..."
          : removed_type}
      </a>
    ));
  });

  Object.keys(mentions).forEach(k => {
    full_text = reactStringReplace(full_text, k, (match, i) => (
      <span className="mention" key={k} title={mentions[k]}>
        {k}
      </span>
    ));
  });

  Object.keys(hashtags).forEach(k => {
    full_text = reactStringReplace(full_text, k, (match, i) => (
      <span className="hashtag" key={k}>
        {k}
      </span>
    ));
  });

  return full_text;
}
