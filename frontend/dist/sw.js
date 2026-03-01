/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-5a5d9309'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "vite.svg",
    "revision": "8e3a10e157f75ada21ab742c022d5430"
  }, {
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7c789f3d9db10f0291baf8497494cf53"
  }, {
    "url": "pwa-192x192.png",
    "revision": "1a32188022a6ed9f8daea085009284dc"
  }, {
    "url": "index.html",
    "revision": "74d353d9692e0b03a6b09e1468e92a31"
  }, {
    "url": "assets/xlsx-CXNIDPrw.js",
    "revision": null
  }, {
    "url": "assets/svg-pathdata-BS8sDzFK.js",
    "revision": null
  }, {
    "url": "assets/stackblur-canvas-BLcWbxEd.js",
    "revision": null
  }, {
    "url": "assets/sonner-DZ5L_EMP.js",
    "revision": null
  }, {
    "url": "assets/set-cookie-parser-l0sNRNKZ.js",
    "revision": null
  }, {
    "url": "assets/scheduler-DDFIhFE4.js",
    "revision": null
  }, {
    "url": "assets/rgbcolor-ChY_S4HG.js",
    "revision": null
  }, {
    "url": "assets/react-router-dom-l0sNRNKZ.js",
    "revision": null
  }, {
    "url": "assets/react-router-D4a3fAgc.js",
    "revision": null
  }, {
    "url": "assets/react-leaflet-D9ZhHFNZ.js",
    "revision": null
  }, {
    "url": "assets/react-dom-DRsyVYWB.js",
    "revision": null
  }, {
    "url": "assets/react-chartjs-2-D9nlpMcw.js",
    "revision": null
  }, {
    "url": "assets/react-Djfz7pm2.js",
    "revision": null
  }, {
    "url": "assets/raf-h3D0PL8Y.js",
    "revision": null
  }, {
    "url": "assets/qrcode.react-DMvS8S2a.js",
    "revision": null
  }, {
    "url": "assets/performance-now-D9FqxX2N.js",
    "revision": null
  }, {
    "url": "assets/pako-D7zkOqXM.js",
    "revision": null
  }, {
    "url": "assets/lucide-react-DHORAFXc.js",
    "revision": null
  }, {
    "url": "assets/leaflet-QRedCW6X.js",
    "revision": null
  }, {
    "url": "assets/leaflet-Bvr-Ab8i.css",
    "revision": null
  }, {
    "url": "assets/jspdf-autotable-CVI6EX_h.js",
    "revision": null
  }, {
    "url": "assets/jspdf-BsjRp7_i.js",
    "revision": null
  }, {
    "url": "assets/iobuffer-BhNq81w-.js",
    "revision": null
  }, {
    "url": "assets/index-DHDtqsQN.css",
    "revision": null
  }, {
    "url": "assets/index-B1bIuRmN.js",
    "revision": null
  }, {
    "url": "assets/html2canvas-C17pzFXx.js",
    "revision": null
  }, {
    "url": "assets/fflate-Ciu_BGOl.js",
    "revision": null
  }, {
    "url": "assets/fast-png-Bdjteh3E.js",
    "revision": null
  }, {
    "url": "assets/dompurify-DaUpxO-q.js",
    "revision": null
  }, {
    "url": "assets/core-js-DgV8WO_T.js",
    "revision": null
  }, {
    "url": "assets/cookie-DWwsNxpa.js",
    "revision": null
  }, {
    "url": "assets/chart.js-C3tolcP7.js",
    "revision": null
  }, {
    "url": "assets/canvg-BA6VSDVd.js",
    "revision": null
  }, {
    "url": "assets/@react-leaflet-BZwRCDI_.js",
    "revision": null
  }, {
    "url": "assets/@kurkle-B7HDCycN.js",
    "revision": null
  }, {
    "url": "assets/@capacitor-B1wJiuvq.js",
    "revision": null
  }, {
    "url": "assets/@babel-B8ot0hyM.js",
    "revision": null
  }, {
    "url": "pwa-192x192.png",
    "revision": "1a32188022a6ed9f8daea085009284dc"
  }, {
    "url": "pwa-512x512.png",
    "revision": "7c789f3d9db10f0291baf8497494cf53"
  }, {
    "url": "manifest.webmanifest",
    "revision": "16ba35d968926db2d32f2bb8a68b2d9c"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
