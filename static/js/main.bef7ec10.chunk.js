(window.webpackJsonpchirpy = window.webpackJsonpchirpy || []).push([
  [0],
  {
    21: function(e, t, n) {
      e.exports = n(52);
    },
    27: function(e, t, n) {},
    52: function(e, t, n) {
      "use strict";
      n.r(t);
      var a = n(4),
        o = n.n(a),
        r = n(9),
        c = n(0),
        i = n.n(c),
        s = n(8),
        l = n.n(s),
        u = (n(27), n(10)),
        d = n(15),
        m = n.n(d);
      var w = function(e) {
        var t = e.data;
        return i.a.createElement("div", null, t.map(h));
      };
      function h(e) {
        var t = (function(e) {
          var t = JSON.parse(JSON.stringify(e)).full_text,
            n = {},
            a = {};
          return (
            e.entities.urls.forEach(function(t) {
              var a = Array.from(e.full_text)
                .slice(t.indices[0], t.indices[1])
                .join("");
              n[a] = { expanded: t.expanded_url, display: t.display_url };
            }),
            e.entities.media &&
              e.entities.media.forEach(function(t) {
                var n = Array.from(e.full_text)
                  .slice(t.indices[0], t.indices[1])
                  .join("");
                a[n] = { media_url: t.media_url_https, type: t.type };
              }),
            Object.keys(n).forEach(function(e) {
              t = m()(t, e, function(t, a) {
                return i.a.createElement(
                  "a",
                  {
                    href: n[e].expanded,
                    target: "_blank",
                    rel: "noopener noreferrer"
                  },
                  n[e].display
                );
              });
            }),
            Object.keys(a).forEach(function(e) {
              var n = a[e].media_url.split("."),
                o = n.pop(),
                r = "jpeg" === o || "jpg" === o ? "jpg" : "png",
                c = n.join("."),
                s = "".concat(c, "?format=").concat(r, "&name=small"),
                l = "".concat(c, "?format=").concat(r, "&name=large");
              t = m()(t, e, function(t, n) {
                return i.a.createElement(
                  "div",
                  { className: "image-container" },
                  i.a.createElement(
                    "a",
                    { href: l, target: "_blank", rel: "noopener noreferrer" },
                    i.a.createElement("img", {
                      src: s,
                      alt: "Embedded " + a[e].type
                    })
                  )
                );
              });
            }),
            t
          );
        })(e);
        return i.a.createElement(
          "div",
          { className: "card container" },
          i.a.createElement(
            "p",
            { className: "container" },
            i.a.createElement(
              "span",
              { className: "bold" },
              "@",
              e.user.screen_name,
              "\xa0\xa0"
            ),
            t
          )
        );
      }
      var f = Object(u.b)(
        function(e) {
          return { data: e.main.data };
        },
        function(e) {
          return {};
        }
      )(w);
      function p() {
        return (p = Object(r.a)(
          o.a.mark(function e() {
            var t, n, a, r, c, i, s, l, u;
            return o.a.wrap(function(e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (
                      ((t = window.localStorage.getItem("oauth_token")),
                      (n = window.localStorage.getItem("oauth_token_secret")),
                      (a = window.localStorage.getItem("oauth_verifier")),
                      t && n)
                    ) {
                      e.next = 6;
                      break;
                    }
                    return (
                      (e.next = 6),
                      fetch(
                        "https://8icruycmzd.execute-api.us-west-2.amazonaws.com/dev/getAuthTokens"
                      )
                        .then(function(e) {
                          return e.json();
                        })
                        .then(function(e) {
                          console.log(e),
                            window.localStorage.setItem(
                              "oauth_token",
                              e.oauth_token
                            ),
                            window.localStorage.setItem(
                              "oauth_token_secret",
                              e.oauth_token_secret
                            ),
                            (window.location = "https://api.twitter.com/oauth/authorize?oauth_token=".concat(
                              e.oauth_token
                            ));
                        })
                        .catch(function(e) {
                          console.log(e);
                        })
                    );
                  case 6:
                    if (
                      (t &&
                        n &&
                        !a &&
                        (r = new URLSearchParams(window.location.search)).has(
                          "oauth_token"
                        ) &&
                        r.has("oauth_verifier") &&
                        r.get("oauth_token") === t &&
                        window.localStorage.setItem(
                          "oauth_verifier",
                          r.get("oauth_verifier")
                        ),
                      (c = window.localStorage.getItem("oauth_verifier")),
                      (i = window.localStorage.getItem("access_token_key")),
                      (s = window.localStorage.getItem("access_token_secret")),
                      (l = window.localStorage.getItem("user_id")),
                      (u = window.localStorage.getItem("screen_name")),
                      !c || (i && s && l && u))
                    ) {
                      e.next = 15;
                      break;
                    }
                    return (
                      (e.next = 15),
                      fetch(
                        "https://8icruycmzd.execute-api.us-west-2.amazonaws.com/dev/getAccessTokens",
                        {
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json"
                          },
                          method: "POST",
                          body: JSON.stringify({
                            key: window.localStorage.getItem("oauth_token"),
                            secret: window.localStorage.getItem(
                              "oauth_token_secret"
                            ),
                            verifier: window.localStorage.getItem(
                              "oauth_verifier"
                            )
                          })
                        }
                      )
                        .then(function(e) {
                          return e.json();
                        })
                        .then(function(e) {
                          console.log(e),
                            window.localStorage.setItem(
                              "access_token_key",
                              e.accTkn
                            ),
                            window.localStorage.setItem(
                              "access_token_secret",
                              e.accTknSecret
                            ),
                            window.localStorage.setItem("user_id", e.userId),
                            window.localStorage.setItem(
                              "screen_name",
                              e.screenName
                            );
                        })
                    );
                  case 15:
                    if (!(c && i && s && l && u)) {
                      e.next = 19;
                      break;
                    }
                    return e.abrupt("return", !0);
                  case 19:
                    throw new Error("Error in auth flow");
                  case 20:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      Boolean(
        "localhost" === window.location.hostname ||
          "[::1]" === window.location.hostname ||
          window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
          )
      );
      var g = n(2),
        _ = n(20);
      var k = { data: [] },
        v = function() {
          var e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : k,
            t = arguments.length > 1 ? arguments[1] : void 0;
          switch (t.type) {
            case "LOAD_INITIAL_DATA":
              return Object.assign({}, e, { data: t.data });
            default:
              return e;
          }
        },
        y = Object(g.c)({ main: v });
      n.d(t, "store", function() {
        return I;
      });
      var S = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || g.d,
        I = Object(g.e)(y, S(Object(g.a)(_.a)));
      (function() {
        return p.apply(this, arguments);
      })()
        .then(
          Object(r.a)(
            o.a.mark(function e() {
              return o.a.wrap(function(e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      I.dispatch(function(e, t) {
                        return fetch(
                          "https://8icruycmzd.execute-api.us-west-2.amazonaws.com/dev/getData",
                          {
                            headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify({
                              key: window.localStorage.getItem(
                                "access_token_key"
                              ),
                              secret: window.localStorage.getItem(
                                "access_token_secret"
                              )
                            })
                          }
                        )
                          .then(function(e) {
                            return e.json();
                          })
                          .then(function(t) {
                            e({ type: "LOAD_INITIAL_DATA", data: t });
                          });
                      });
                    case 1:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          )
        )
        .catch(function(e) {
          console.log(e);
        }),
        l.a.render(
          i.a.createElement(u.a, { store: I }, i.a.createElement(f, null)),
          document.getElementById("root")
        ),
        "serviceWorker" in navigator &&
          navigator.serviceWorker.ready.then(function(e) {
            e.unregister();
          });
    }
  },
  [[21, 1, 2]]
]);
//# sourceMappingURL=main.bef7ec10.chunk.js.map
