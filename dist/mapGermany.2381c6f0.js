// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"scripts/mapGermany.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadMap = LoadMap;
var colorBackground, colorText, blHoovered; // `labelBlArray` stores the names of all the Bundesländer which are appended to the svg

var labelBlArray = []; // `clickedBlArray` stores the names of all the Bundesländer which have been selected via click

var clickedBlArray = [];

function LoadMap() {
  // Source http://opendatalab.de/projects/geojson-utilities/
  d3.json('../src/data/bundeslaender.geojson').then(function (geojson) {
    var width = 900;
    var height = 500;
    var svg = d3.select("#mapGermany").classed("svg-container", true).append("svg").attr("class", "map-germany") //.attr("preserveAspectRatio", "xMinYMin meet")
    //.attr("viewBox", "0 0 600 400")
    //.classed("svg-content-responsive", true)
    .attr("id", "svgMap").attr("width", width).attr("height", height);
    var projection = d3.geoMercator();
    projection.fitSize([width, height], geojson);
    var path = d3.geoPath().projection(projection);
    var color = d3.scaleOrdinal(d3.schemeBlues[9].slice(2, 9));
    var offset = geojson.offset;
    svg.selectAll("path").data(geojson.features).enter().append("path").attr("d", path).attr("class", function (d) {
      return d.properties.GEN;
    }) // Sets the name of the Bundesland as the classname
    .attr("fill", function (d, i) {
      return color(i);
    }).attr("stroke", "#FFF").attr("stroke-width", 0.5);
    svg.append("g").selectAll("text").data(geojson.features).enter().append("text").attr("text-anchor", "middle").attr("font-size", 11).attr("id", function (d) {
      return d.properties.GEN;
    }) // Sets the name of the Bundesland as the ID
    .attr("x", function (d) {
      var bl = d.properties.GEN;

      if (offset[bl] != undefined) {
        return projection(offset[bl])[0];
      }
    }).attr("y", function (d) {
      var bl = d.properties.GEN;
      if (offset[bl] != undefined) return projection(offset[bl])[1];
    }).text(function (d) {
      // Only fill the text if there is no text for the Bundesland yet
      var textBool = false;
      labelBlArray.forEach(function (bl) {
        if (bl === d.properties.GEN || d.properties.GEN.includes("Bodensee")) {
          textBool = true; // Bodensee needs to be mentioned explicitly
        }
      });

      if (textBool === false) {
        labelBlArray.push(d.properties.GEN);
        return d.properties.GEN;
      }
    }).on("mouseover", highlightBl).on("mouseout", resetBlColor).on("click", clickEvent).style("cursor", "pointer");
  }); // Hide map

  document.getElementById('mapGermany').style.display = 'none';
}

function highlightBl() {
  // Get the name of the Bundesland currently hoovered over via the ID of the HTML element
  blHoovered = d3.select(this)._groups[0][0].id; // The name of the Bundesland was given as a class name to each path and with its help gets filled now

  colorBackground = d3.select("." + blHoovered).attr("fill");
  d3.select("." + blHoovered).attr("fill", "#009688");
  colorText = d3.select(this).attr("fill");
  d3.select(this).attr("fill", "white").attr("font-weight", "bold");
}

function resetBlColor() {
  var _this = this;

  // Check if the hovered over Bundesland was clicked
  var isBlClicked = false;
  clickedBlArray.forEach(function (bl) {
    if (_this.id === bl) {
      isBlClicked = true;
    }
  }); // If it wasn't clicked its color is reset

  if (isBlClicked === false) {
    d3.select("." + blHoovered).attr("fill", colorBackground);
    d3.select(this).attr("fill", colorText).attr("font-weight", "normal");
  }
}

function clickEvent() {
  var clickedBl = d3.select(this)._groups[0][0].id; // Check if a Bundesland has already been clicked


  var clickedBool = false;
  clickedBlArray.forEach(function (bl) {
    if (bl === clickedBl) {
      clickedBool = true;
    }
  }); // If the clicked on Bundesland wasn't clicked before, it is marked and added to `clickedBlArray`

  if (clickedBool === false & clickedBlArray.length <= 3) {
    d3.select("." + d3.select(this)._groups[0][0].id).attr("fill", "#009688");
    clickedBlArray.push(blHoovered); // Necessary to get the selected Bundesland in main.js

    d3.select(this)._groups[0][0].classList.add('selected-bl');
  }
  /** If it has been clicked before the selection is revoked by changing the stroke coloring and removing the 
  	Bundesland from the array.
  */
  else if (clickedBool === true) {
      d3.select("." + d3.select(this)._groups[0][0].id).attr("stroke", "white").attr("fill", colorBackground).attr("stroke-width", 0.5);
      var index = clickedBlArray.indexOf(clickedBl);
      clickedBlArray.splice(index, 1); // Necessary to get the selected Bundesland in main.js

      d3.select(this)._groups[0][0].classList.remove('selected-bl');
    } // Alert when more when the user wants to select more than 4 Bundesländer. This would get too messy for the line chart.
    else if (clickedBlArray.length == 4) {
        alert("Du hast bereits 5 Bundesländer ausgewählt. Entferne eins per Klick, um ein neues auswählen zu können.");
      }
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55201" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/mapGermany.js"], null)
//# sourceMappingURL=/mapGermany.2381c6f0.js.map