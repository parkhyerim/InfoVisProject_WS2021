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
})({"scripts/lineChartView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/** `exportDate` is set in the event handler added to the ticks of the xAxis. 
  It contains the selected date which should be used for the treemap.
  To import the clicked date use `import date from './lineChartView.js' in the treemap file`.
  Make sure that the type of the treemap file is set to `module` in the index.html file, e.g.:
   <script type="module" src="scripts/values.js" ></script>
  */
var exportDate = new Date();
var _default = exportDate;
exports.default = _default;
var svg, xAxis, yAxis;
var blDomainStorage = [];
var margin = {
  top: 10,
  right: 30,
  bottom: 60,
  left: 60
},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
var selectedMonth;
/** Saves the checked checkboxes to the array `blDomainStorage` 
  and visualises the chosen Bundesland.
*/

function visualiseChosenBL(checkboxes, selectedMonth) {
  var _this = this;

  // Pushes the names of the chosen Bundesland into the array `blDomainStorage`
  var _iterator = _createForOfIteratorHelper(checkboxes),
      _step;

  try {
    var _loop = function _loop() {
      var checkbox = _step.value;
      var foundBL = false;
      var foundDate = false;
      blDomainStorage.forEach(function (arr) {
        if (checkbox.value == arr[0]) foundBL = true;
      });
      if (_this.selectedMonth == selectedMonth) foundDate = true; // Checks if Bundesland is newly checked or if it already exists in blDomainStorage

      if (checkbox.checked && foundBL == false) {
        // Fetching the data of the newly selected Bundesland
        fetchData(checkbox.value, selectedMonth).then(function (data) {
          // To figure out the max y-value which is necessary to correctly display the data
          var neededYValue = d3.scaleLinear().domain([0, d3.max(data, function (item) {
            return item.Infos.AnzahlFall;
          })]);
          /** Sorts the array in increasing order.
            The Bundesland with the smallest needed y-value comes first and the one with the highest comes last.
          */

          blDomainStorage.sort(function (a, b) {
            return a[1] - b[1];
          });
          /** Checks whether the last Bundesland in `blDomainStorage` still obtains the highest needed
            y-value compared to the newly selected Bundesland. If the newly checked Bundesland has
            more Covid cases and therefore needs a higher y-value the current axes are removed 
            and the updated ones are added.
          */

          if (blDomainStorage.length == 0 || blDomainStorage[blDomainStorage.length - 1][1] < neededYValue.domain()[1]) {
            svg.select(".y-axis").remove(); // instead of deleting they should be updated,

            svg.select(".x-axis").remove(); // but that seems more complicated

            svg.select(".case-line").remove(); //removes existing vertical line

            addAxes(data);
          } // Stores the Bundesland and the highest y-value needed for that Bundesland


          blDomainStorage.push([data[0].Infos.Bundesland, neededYValue.domain()[1]]);
          /** The curve of the newly selected Bundesland is added.
            `blClassN` is necessary to give each curve a distinguishable class name.
            It will be used to select the d3 element and then to update and delete it.
          */

          var blClassN = data[0].Infos.Bundesland;
          visualiseCurve(svg, data, xAxis, yAxis, blClassN, "turquoise"); // Circles of the already displayed Bundesländer are updated according to the new axis. 

          updateExistingCurvesCircles(blDomainStorage);
        });
      } else if (!checkbox.checked && foundBL == true) {
        // Removes the curve and circles of the recently unselected Bundesland.
        svg.select(".curve." + checkbox.value).remove();
        svg.selectAll(".circles." + checkbox.value).remove();
        /** Sorts the array in increasing order.
           The Bundesland with the smallest needed y-value comes first and the one with the 
           highest comes last.
         */

        blDomainStorage.sort(function (a, b) {
          return a[1] - b[1];
        }); // Removes the recently unselected Bundesland from `blDomainStorage`

        blDomainStorage.forEach(function (arr, i) {
          if (arr[0] == checkbox.value) {
            blDomainStorage.splice(i, 1);
          }
        });
        /** Updates the axes, the existing curves and circles if the highest needed y-value 
          has changed after unselecting a Bundesland
        */

        if (yAxis.domain()[1] > blDomainStorage[blDomainStorage.length - 1][1]) {
          fetchData(blDomainStorage[blDomainStorage.length - 1][0], selectedMonth).then(function (data) {
            svg.select(".y-axis").remove();
            svg.select(".x-axis").remove();
            svg.select(".case-line").remove(); //removes existing vertical line

            addAxes(data);
            updateExistingCurvesCircles(blDomainStorage);
          });
        }
      }
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function initializeSVG() {
  console.log("in initialize");
  svg = d3.select("#visualisationContainer").append("div").classed("svg-container", true).append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("viewBox", "0 0 600 400").classed("svg-content-responsive", true).append("g").attr("transform", "translate(".concat(margin.left, ", ").concat(margin.top, ")"));
}

function fetchData(bundesland, selectedMonth) {
  return fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=Meldedatum%20%3E%3D%20TIMESTAMP%20%27".concat(selectedMonth[0], "%2000%3A00%3A00%27%20AND%20Meldedatum%20%3C%3D%20TIMESTAMP%20%27").concat(selectedMonth[1], "%2000%3A00%3A00%27%20AND%20Bundesland%20%3D%20%27").concat(bundesland, "%27&outFields=Bundesland,AnzahlFall,Meldedatum,IdBundesland&outSR=4326&f=json"), {
    method: 'GET'
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    /** `casesData` is the array where the fetched data will be stored in.
      `feed` is the array of objects returned by the request.
      Each array entry has the following schema
      [attributes: {Bundesland: "", AnzahlFall: "", IdBundesland: "", Meldedatum: ""}]
      By iterating through `feed` and pushing the objects to `casesData` one depth is removed so
      the data can be handled more easily.
    */
    var casesData = [];
    var feed = data.features;
    feed.forEach(function (elem) {
      casesData.push(elem.attributes);
    });
    return groupDataByDate(casesData);
  });
}

;
/** Groups the received data by date. After the grouping the data is sorted
  datewise and returned as an array
*/

function groupDataByDate(casesData) {
  /** `dataEntries` is a new object and `currentValue` is the item of the array 
    currently looked at
  */
  var groupedReport = casesData.reduce(function (dataEntries, currentValue) {
    var day = new Date(currentValue['Meldedatum']);
    /** Within the first iteration of `reduce` `dataEntries` is undefined. 
      Consequently a new object entry with the `Meldedatum` as the key is being added to
      `dataEntries`. Further information (Bundesland, IdBundesland, AnzahlFall) 
      are added as a value.       
    */

    if (dataEntries[day] !== undefined) {
      /** If a key with the `Meldedatum` already exists the number of cases are
        summed up.
      */
      dataEntries[day].AnzahlFall = dataEntries[day].AnzahlFall + currentValue.AnzahlFall;
    } else {
      dataEntries[day] = {
        Bundesland: currentValue.Bundesland,
        IdBundesland: currentValue.IdBundesland,
        AnzahlFall: currentValue.AnzahlFall
      };
    }

    return dataEntries;
  }, {}); // `dataEntries` gets transformed into an array so it can be easily sorted by date  

  var reportArr = [];
  Object.entries(groupedReport).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    reportArr.push({
      Meldedatum: key,
      Infos: value
    });
  }); // Sorts the array containing the summed up cases by `Meldedatum`

  reportArr.sort(function (a, b) {
    return b.Meldedatum - a.Meldedatum;
  });
  return reportArr;
}

function addAxes(data) {
  /** The next 7 lines initialize and format the labels of the xAxis nicely.    
    If there are too less dates will be repeated on the x-axis. To avoid that we have to create a function 
    for that edge case and work with xa.tickValues to set the labels manually.
    xA.tickValues([new Date(data[0].Meldedatum), new Date(data[1].Meldedatum), new Date(data[2].Meldedatum)])
  */
  xAxis = d3.scaleTime().domain(d3.extent(data, function (item) {
    return new Date(item.Meldedatum);
  })).range([0, width]);
  var xA = d3.axisBottom(xAxis);
  xA.tickSizeOuter(0); // removes the last tick on the xAxis

  var parseDate = d3.timeFormat("%B %d, %Y"); //https://d3-wiki.readthedocs.io/zh_CN/master/Time-Scales/

  xA.tickFormat(function (d) {
    return parseDate(d);
  }); // Appends the xAxis

  svg.append("g").attr("transform", "translate(0, ".concat(height, ")")).attr("class", "x-axis").call(xA).selectAll("text").attr("transform", "rotate(330)") //rotates the labels of the x axis by 
  .style("text-anchor", "end"); //makes sure that the end of the text string is anchored to the ticks

  /** Selects all the labels on the xAxis. 
   The cursor becomes a pointer when moving the mouse over the xAxis labels.
   When clicking on one label the function `appendVerticalLine` is being called 
   and the selected `date` set so it can be exported. (See top of this file)
  */

  var labels = d3.selectAll('g.tick');
  labels.on("mouseover", function (mouseEvent) {
    d3.select(mouseEvent.target).style("cursor", "pointer"); // the pointer isn't visible anymore for some reason
  });
  labels.on("click", function (mouseEvent, date) {
    appendVerticalLine(svg, xAxis, date, height);
    exportDate = date;
  }); // Initializes and formats the yAxis

  yAxis = d3.scaleLinear().domain([0, d3.max(data, function (item) {
    return item.Infos.AnzahlFall;
  })]).range([height, 0]).nice(); //without that the highest tick of the y axis wouldn't be labelled
  // Appends the yAxis

  svg.append("g").call(d3.axisLeft(yAxis)).attr("class", "y-axis"); // Class added to be able to remove the axis;
}

function visualiseCurve(svg, formattedData, xAxis, yAxis, classN, color) {
  svg.append("path").datum(formattedData).attr("fill", "none").attr("id", classN).attr("stroke", color).attr("stroke-width", 1).attr("class", "curve" + " " + classN) //necessary to add a specific class for every Bundesland shown
  .attr("d", d3.line().x(function (item) {
    return xAxis(new Date(item.Meldedatum));
  }).y(function (item) {
    return yAxis(new Date(item.Infos.AnzahlFall));
  })); // Appends name of the Bundesland to the corresponding path

  svg.append("text").attr("x", 5) // move the text from the start of the path
  .attr("dy", 15) // move the text down
  .append("textPath").attr("xlink:href", "#" + classN).text(formattedData[0].Infos.Bundesland); // Appends circles to the path at the dates where data is returned

  svg.selectAll("circles").data(formattedData).enter().append("circle").attr("class", "circles" + " " + classN).attr("fill", "darkblue").attr("stroke", "none").attr("cx", function (item) {
    return xAxis(new Date(item.Meldedatum));
  }).attr("cy", function (item) {
    return yAxis(new Date(item.Infos.AnzahlFall));
  }).attr("r", 2);
} // Appends a vertical line at the selected date


function appendVerticalLine(svg, xAxis, date, height) {
  d3.select(".case-line").remove(); //removes existing vertical line

  svg.append("line").attr("class", "case-line").attr("x1", xAxis(date)).attr("y1", 0).attr("x2", xAxis(date)).attr("y2", height).style("stroke-width", 1).style("stroke", "darkblue").style("fill", "none");
}

function updateExistingCurvesCircles(storageArray) {
  storageArray.forEach(function (arr) {
    svg.select(".curve." + arr[0]).attr("d", d3.line().x(function (item) {
      return xAxis(new Date(item.Meldedatum));
    }).y(function (item) {
      return yAxis(new Date(item.Infos.AnzahlFall));
    }));
    svg.selectAll(".circles." + arr[0]).attr("cx", function (item) {
      return xAxis(new Date(item.Meldedatum));
    }).attr("cy", function (item) {
      return yAxis(new Date(item.Infos.AnzahlFall));
    });
  });
}

module.exports = {
  initializeSVG: initializeSVG,
  visualiseChosenBL: visualiseChosenBL
};
},{}],"scripts/datePicker.js":[function(require,module,exports) {
function toggleDatePicker(event, cb) {
  if (!event.target.matches('#datePickerButton')) {
    var dropdowns = document.getElementsByClassName("dropdown");
    var i;

    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];

      if (!openDropdown.classList.contains('hidden')) {
        openDropdown.classList.add('hidden');
      }
    }

    if (event.target.matches('.date')) {
      datePicked(event.target.textContent);
      cb();
    }
  } else {
    document.getElementById("dateDropdown").classList.toggle("hidden");
  }
}

function datePicked(month) {
  document.getElementById('datePickerButton').textContent = month;
}

function getDateForFetch() {
  switch (document.getElementById('datePickerButton').textContent) {
    case "März 2020":
      return ["2020-03-01", "2020-04-01"];

    case "April 2020":
      return ["2020-04-01", "2020-05-01"];

    case "Mai 2020":
      return ["2020-05-01", "2020-06-01"];

    case "Juni 2020":
      return ["2020-06-01", "2020-07-01"];

    case "Juli 2020":
      return ["2020-07-01", "2020-08-01"];

    case "August 2020":
      return ["2020-08-01", "2020-09-01"];

    case "September 2020":
      return ["2020-09-01", "2020-10-01"];

    case "Oktober 2020":
      return ["2020-10-01", "2020-11-01"];

    case "November 2020":
      return ["2020-11-01", "2020-12-01"];

    case "Dezember 2020":
      return ["2020-12-01", "2021-01-01"];

    case "Januar 2021":
      return ["2021-01-01", "2021-02-01"];

    case "Februar 2021":
      return ["2021-02-01", "2021-03-01"];

    default:
      return ["2020-03-01", "2020-04-01"];
  }
}

module.exports = {
  getDateForFetch: getDateForFetch,
  toggleDatePicker: toggleDatePicker
};
},{}],"main.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var lineChartView = require("./scripts/lineChartView.js");

var datePicker = require("./scripts/datePicker.js"); // This is the entry point for the Bundesländer select via the treemap later on


var checkboxes = document.getElementsByClassName('checkbox');

function initialiseEvents() {
  window.onclick = function (event) {
    datePicker.toggleDatePicker(event, updateLineChart);
  };

  var _iterator = _createForOfIteratorHelper(checkboxes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var checkbox = _step.value;
      checkbox.addEventListener('change', function () {
        updateLineChart();
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

function updateLineChart() {
  lineChartView.visualiseChosenBL(checkboxes, datePicker.getDateForFetch());
}

lineChartView.initializeSVG();
initialiseEvents();
},{"./scripts/lineChartView.js":"scripts/lineChartView.js","./scripts/datePicker.js":"scripts/datePicker.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65382" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map