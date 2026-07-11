if (!self.define) {
  let e,
    s = {};
  const i = (i, n) => (
    (i = new URL(i + ".js", n).href),
    s[i] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          ((e.src = i), (e.onload = s), document.head.appendChild(e));
        } else ((e = i), importScripts(i), s());
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, r) => {
    const t =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[t]) return;
    let o = {};
    const l = (e) => i(e, t),
      u = { module: { uri: t }, exports: o, require: l };
    s[t] = Promise.all(n.map((e) => u[e] || l(e))).then((e) => (r(...e), o));
  };
}
define(["./workbox-9c191d2f"], function (e) {
  "use strict";
  (self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "registerSW.js", revision: "1b6d020c4d0325f51fcfe83201f2e724" },
        { url: "index.html", revision: "29cfac63bb74c08ce865e0dab273867a" },
        { url: "assets/index-DX4gkzi3.js", revision: null },
        { url: "assets/index-7q4a39Xx.css", revision: null },
        { url: "assets/bundler-BQhO7P4A.js", revision: null },
        { url: "favicon.svg", revision: "7e840862161341271697daa99a40d76b" },
        {
          url: "manifest.webmanifest",
          revision: "c3617e1d661066d1e429305a7c6110ef",
        },
      ],
      {},
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      new e.NavigationRoute(e.createHandlerBoundToURL("index.html")),
    ));
});
