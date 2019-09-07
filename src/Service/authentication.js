export async function runAuthentication() {
  const currentToken1 = window.localStorage.getItem("oauth_token");
  const currentToken2 = window.localStorage.getItem("oauth_token_secret");
  const currentToken3 = window.localStorage.getItem("oauth_verifier");

  if (!currentToken1 || !currentToken2) {
    // get app oauth tokens
    await fetch(
      `${
        process.env.REACT_APP_API_URL
      }getAuthTokens?callback=${window.encodeURIComponent(
        process.env.REACT_APP_CALLBACK_URL
      )}`
    )
      .then(res => res.json())
      .then(response => {
        // {"oauth_token":"","oauth_token_secret":"","oauth_callback_confirmed":"true"}
        window.localStorage.setItem("oauth_token", response.oauth_token);
        window.localStorage.setItem(
          "oauth_token_secret",
          response.oauth_token_secret
        );
        window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${response.oauth_token}`;
      })
      .catch(err => {
        console.log(err);
      });
  }

  // this will run when redirect process appends querystring to url
  if (currentToken1 && currentToken2 && !currentToken3) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("oauth_token") && urlParams.has("oauth_verifier")) {
      if (urlParams.get("oauth_token") === currentToken1) {
        window.localStorage.setItem(
          "oauth_verifier",
          urlParams.get("oauth_verifier")
        );
      }
    }
  }

  const oauthVerifier = window.localStorage.getItem("oauth_verifier");
  const currentToken4 = window.localStorage.getItem("access_token_key");
  const currentToken5 = window.localStorage.getItem("access_token_secret");
  const currentToken6 = window.localStorage.getItem("user_id");
  const currentToken7 = window.localStorage.getItem("screen_name");

  if (
    oauthVerifier &&
    (!currentToken4 || !currentToken5 || !currentToken6 || !currentToken7)
  ) {
    // get user access tokens
    await fetch(`${process.env.REACT_APP_API_URL}getAccessTokens`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        key: window.localStorage.getItem("oauth_token"),
        secret: window.localStorage.getItem("oauth_token_secret"),
        verifier: window.localStorage.getItem("oauth_verifier")
      })
    })
      .then(response => response.json())
      .then(response => {
        window.localStorage.setItem("access_token_key", response.accTkn);
        window.localStorage.setItem(
          "access_token_secret",
          response.accTknSecret
        );
        window.localStorage.setItem("user_id", response.userId);
        window.localStorage.setItem("screen_name", response.screenName);
        window.location.href = window.location.hostname;
      });
  }

  if (
    oauthVerifier &&
    currentToken4 &&
    currentToken5 &&
    currentToken6 &&
    currentToken7
  ) {
    return true;
  } else {
    return false;
  }
}
